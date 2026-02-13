export interface Role {
  id: number;
  level_role: string;
  nama_role: string;
  keterangan: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface CreateRoleDTO {
  level_role: string;
  nama_role: string;
  keterangan?: string;
}

export interface UpdateRoleDTO {
  level_role?: string;
  nama_role?: string;
  keterangan?: string;
}

export interface RoleResponse {
  id: number;
  level_role: string;
  nama_role: string;
  keterangan: string | null;
}
