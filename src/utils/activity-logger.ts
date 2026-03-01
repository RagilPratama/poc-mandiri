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
  // Get headers properly (might be Map or object)
  const hdrs = context.headers || {};
  const userAgent = hdrs['user-agent'] || hdrs.get?.('user-agent') || 'unknown';
  
  // Get IP (try multiple places)
  let ip = hdrs['x-forwarded-for'] || hdrs.get?.('x-forwarded-for');
  if (!ip) ip = hdrs['x-real-ip'] || hdrs.get?.('x-real-ip');
  if (!ip && context.request?.ip) ip = context.request.ip;
  if (!ip && context.request?.socket?.remoteAddress) ip = context.request.socket.remoteAddress;
  if (!ip) ip = '127.0.0.1'; // fallback untuk localhost
  
  // Handle proxy chain
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return {
    user_id: context.user?.id || hdrs['x-user-id'] || hdrs.get?.('x-user-id'),
    username: context.user?.username || hdrs['x-username'] || hdrs.get?.('x-username'),
    email: context.user?.email || hdrs['x-user-email'] || hdrs.get?.('x-user-email'),
    ip_address: ip || 'unknown',
    user_agent: userAgent,
    method: context.request?.method || 'UNKNOWN',
    endpoint: context.path || context.request?.url || 'unknown',
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

// Async logging function - non-blocking, fire-and-forget
export async function logActivityAsync(params: SimpleLogParams) {
  try {
    const { enqueueActivityLog } = await import('./queue');
    const userInfo = extractUserInfo(params.context);

    const logData = {
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
      data_lama: params.data_lama ? JSON.stringify(params.data_lama) : null,
      data_baru: params.data_baru ? JSON.stringify(params.data_baru) : null,
      status: params.status || 'SUCCESS',
      error_message: params.error_message,
      created_at: new Date(),
    };

    // Enqueue - don't await, fire-and-forget
    enqueueActivityLog(logData).catch((err) => {
      console.error('Failed to enqueue activity log:', err);
    });
  } catch (error) {
    console.error('logActivityAsync error:', error);
  }
}
