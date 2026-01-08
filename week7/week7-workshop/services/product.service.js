// ============================================
// SERVICE LAYER - Products
// ============================================

const ProductDB = require('../database/products.db');

class ProductService {
    // ===== GET ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getAllProducts() {
        try {
            const products = await ProductDB.findAll();
            return products;
        } catch (error) {
            throw new Error(`Failed to get products: ${error.message}`);
        }
    }

    // ===== GET BY ID =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getProductById(id) {
        try {
            const product = await ProductDB.findById(id);
            
            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            throw error;
        }
    }

    // ===== CREATE =====
    // ⚠️ นักศึกษาเติม Validation
  static async createProduct(productData) {
    try {
        // Validate using helper method
        this.validateProductData(productData);
        
        // Create product
        const newProduct = await ProductDB.create(productData);
        return newProduct;
    } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`);
    }
}

    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ด
 static async updateProduct(id, productData) {
    try {
        // 1. Check if exists
        const existingProduct = await ProductDB.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }

        // 2. Validate
        this.validateProductData(productData);

        // 3. Update
        await ProductDB.update(id, productData);

        // 4. Return updated product
        return await ProductDB.findById(id);
    } catch (error) {
        throw error;
    }
}

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
 static async deleteProduct(id) {
    try {
        const product = await ProductDB.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const result = await ProductDB.delete(id);
        
        if (result.changes === 0) {
            throw new Error('Failed to delete product');
        }

        return { message: 'Product deleted successfully' };
    } catch (error) {
        throw error;
    }
}

    // ===== SEARCH =====
    // ✅ ให้โค้ดสมบูรณ์
    static async searchProducts(keyword) {
        try {
            if (!keyword || keyword.trim() === '') {
                throw new Error('Search keyword is required');
            }

            const products = await ProductDB.search(keyword);
            return products;
        } catch (error) {
            throw error;
        }
    }

    // ===== VALIDATION =====
    static validateProductData(data) {
        const { name, category_id, price, stock } = data;

        if (!name || !category_id || price === undefined || stock === undefined) {
            throw new Error('Missing required fields');
        }

        if (price < 0) {
            throw new Error('Price must be greater than or equal to 0');
        }

        if (stock < 0) {
            throw new Error('Stock must be greater than or equal to 0');
        }
    }
}

module.exports = ProductService;