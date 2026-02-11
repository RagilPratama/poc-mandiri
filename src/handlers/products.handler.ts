import { ProductRepository } from "../repositories/product.repository";

const productRepo = new ProductRepository();

export const productHandlers = {
    async getAllProducts({ query }: { query: { page?: number; limit?: number } }) {
    try {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const products = await productRepo.getProduct(page, limit);
        const total = await productRepo.countProducts();
        
        return {
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        };
    } catch (error) {
        return {
        success: false,
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
        };
    }
    },
};