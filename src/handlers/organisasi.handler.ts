import { OrganisasiRepository } from '../repositories/organisasi.repository';
import type { CreateOrganisasiDTO, UpdateOrganisasiDTO } from '../types/organisasi';

const organisasiRepo = new OrganisasiRepository();

export const organisasiHandlers = {
  async getAll({ query }: { query: { page?: string; limit?: string; search?: string } }) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const search = query.search;

      const result = await organisasiRepo.findAll(page, limit, search);
      return { 
        success: true,
        ...result
      };
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const org = await organisasiRepo.findById(params.id);
      
      if (!org) {
        return {
          success: false,
          message: 'Organisasi not found',
        };
      }

      return {
        success: true,
        data: org,
      };
    } catch (error) {
      console.error('Error fetching organisasi:', error);
      throw error;
    }
  },

  async create({ body }: { body: CreateOrganisasiDTO }) {
    try {
      const org = await organisasiRepo.create(body);
      
      return {
        success: true,
        data: org,
        message: 'Organisasi created successfully',
      };
    } catch (error) {
      console.error('Error creating organisasi:', error);
      throw error;
    }
  },

  async update({ params, body }: { params: { id: number }; body: UpdateOrganisasiDTO }) {
    try {
      const org = await organisasiRepo.update(params.id, body);
      
      if (!org) {
        return {
          success: false,
          message: 'Organisasi not found',
        };
      }

      return {
        success: true,
        data: org,
        message: 'Organisasi updated successfully',
      };
    } catch (error) {
      console.error('Error updating organisasi:', error);
      throw error;
    }
  },

  async delete({ params }: { params: { id: number } }) {
    try {
      const org = await organisasiRepo.delete(params.id);
      
      if (!org) {
        return {
          success: false,
          message: 'Organisasi not found',
        };
      }

      return {
        success: true,
        message: 'Organisasi deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting organisasi:', error);
      throw error;
    }
  },
};
