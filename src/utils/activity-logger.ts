import { db } from '../db';
import { trxLogAktivitas } from '../db/schema';

interface LogActivityParams {
  pegawai_id?: number;
  user_id?: string;
  username?: string;
  email?: string;
  aktivitas: string; // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'
  modul: string; // 'PEGAWAI', 'ABSENSI', 'BANTUAN', 'AUTH', etc.
  deskripsi: string;
  method?: string; // 'GET', 'POST', 'PUT', 'DELETE'
  endpoint?: string;
  ip_address?: string;
  user_agent?: string;
  data_lama?: any;
  data_baru?: any;
  status?: 'SUCCESS' | 'FAILED' | 'ERROR';
  error_message?: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await db.insert(trxLogAktivitas).values({
      pegawai_id: params.pegawai_id,
      user_id: params.user_id,
      username: params.username,
      email: params.email,
      aktivitas: params.aktivitas,
      modul: params.modul,
      deskripsi: params.deskripsi,
      method: params.method,
      endpoint: params.endpoint,
      ip_address: params.ip_address,
      user_agent: params.user_agent,
      data_lama: params.data_lama ? JSON.stringify(params.data_lama) : null,
      data_baru: params.data_baru ? JSON.stringify(params.data_baru) : null,
      status: params.status || 'SUCCESS',
      error_message: params.error_message,
    });
  } catch (error) {
    // Don't throw error to prevent breaking the main flow
    console.error('Failed to log activity:', error);
  }
}

// Helper function to extract user info from context
export function extractUserInfo(context: any) {
  // Get IP address with priority: x-forwarded-for > x-real-ip > direct connection
  let ip_address = context.headers?.['x-forwarded-for'];
  if (!ip_address) {
    ip_address = context.headers?.['x-real-ip'];
  }
  if (!ip_address && context.request) {
    // For Elysia, IP might be in different places
    ip_address = context.request.ip || context.request.socket?.remoteAddress;
  }
  
  // If x-forwarded-for contains multiple IPs (proxy chain), take the first one (original client)
  if (ip_address && ip_address.includes(',')) {
    ip_address = ip_address.split(',')[0].trim();
  }

  return {
    user_id: context.user?.id || context.headers?.['x-user-id'],
    username: context.user?.username || context.headers?.['x-username'],
    email: context.user?.email || context.headers?.['x-user-email'],
    ip_address: ip_address || 'unknown',
    user_agent: context.headers?.['user-agent'] || 'unknown',
    method: context.request?.method,
    endpoint: context.path || context.request?.url,
  };
}

// Simplified logging function - combines extractUserInfo and logActivity
interface SimpleLogParams {
  context: any; // Elysia context with headers, request, path
  aktivitas: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW';
  modul: string;
  deskripsi: string;
  data_lama?: any;
  data_baru?: any;
  status?: 'SUCCESS' | 'FAILED' | 'ERROR';
  error_message?: string;
}

export async function logActivitySimple(params: SimpleLogParams) {
  const userInfo = extractUserInfo(params.context);
  
  await logActivity({
    user_id: userInfo.user_id,
    username: userInfo.username,
    email: userInfo.email,
    ip_address: userInfo.ip_address,
    user_agent: userInfo.user_agent,
    method: userInfo.method,
    endpoint: userInfo.endpoint,
    aktivitas: params.aktivitas,
    modul: params.modul,
    deskripsi: params.deskripsi,
    data_lama: params.data_lama,
    data_baru: params.data_baru,
    status: params.status || 'SUCCESS',
    error_message: params.error_message,
  });
}
