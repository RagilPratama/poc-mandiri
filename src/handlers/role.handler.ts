import { RoleRepository } from '../repositories/role.repository';
import type { CreateRoleDTO, UpdateRoleDTO } from '../types/role';

const roleRepo = new RoleRepository();

export const roleHandlers = {
  async getAll({ query }: { query: { page?: string; limit?: string; search?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const search = query.search;

      const result = await roleRepo.findAll(page, limit, search);
      return { 
        success: true,
        ...result
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const role = await roleRepo.findById(params.id);
      
      if (!role) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        data: role,
      };
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  async create({ body }: { body: CreateRoleDTO }) {
    try {
      const role = await roleRepo.create(body);
      
      return {
        success: true,
        data: role,
        message: 'Role created successfully',
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  async update({ params, body }: { params: { id: number }; body: UpdateRoleDTO }) {
    try {
      const role = await roleRepo.update(params.id, body);
      
      if (!role) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        data: role,
        message: 'Role updated successfully',
      };
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  async delete({ params }: { params: { id: number } }) {
    try {
      const role = await roleRepo.delete(params.id);
      
      if (!role) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },
};
