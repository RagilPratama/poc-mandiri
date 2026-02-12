import { unitPelaksanaanTeknisRepository } from '../repositories/unit-pelaksanaan-teknis.repository';
import type { CreateUnitPelaksanaanTeknisDTO, UpdateUnitPelaksanaanTeknisDTO } from '../types/unit-pelaksanaan-teknis';

export const unitPelaksanaanTeknisHandler = {
  async getAll() {
    try {
      const data = await unitPelaksanaanTeknisRepository.findAll();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch unit pelaksanaan teknis',
      };
    }
  },

  async getById({ params }: { params: { id: number } }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.findById(params.id);
      
      if (!data) {
        return {
          success: false,
          message: 'Unit pelaksanaan teknis not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch unit pelaksanaan teknis',
      };
    }
  },

  async create({ body }: { body: CreateUnitPelaksanaanTeknisDTO }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.create(body);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create unit pelaksanaan teknis',
      };
    }
  },

  async update({ params, body }: { params: { id: number }; body: UpdateUnitPelaksanaanTeknisDTO }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.update(params.id, body);
      
      if (!data) {
        return {
          success: false,
          message: 'Unit pelaksanaan teknis not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update unit pelaksanaan teknis',
      };
    }
  },

  async delete({ params }: { params: { id: number } }) {
    try {
      const data = await unitPelaksanaanTeknisRepository.delete(params.id);
      
      if (!data) {
        return {
          success: false,
          message: 'Unit pelaksanaan teknis not found',
        };
      }

      return {
        success: true,
        message: 'Unit pelaksanaan teknis deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete unit pelaksanaan teknis',
      };
    }
  },
};
