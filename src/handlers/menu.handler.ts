import { MenuRepository } from "../repositories/menu.repository";

const menuRepo = new MenuRepository();

export const menuHandlers = {
  async getAllMenus() {
    try {
      const menus = await menuRepo.getAllMenus();
      return {
        success: true,
        data: menus,
        total: menus.length,
      };
    } catch (error) {
      console.error("Error fetching menus:", error);
      return {
        success: false,
        error: "Failed to fetch menus",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
