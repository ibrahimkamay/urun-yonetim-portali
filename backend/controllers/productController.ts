import { Request, Response } from "express";
import ProductService from "../services/productServices";

class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProduct();
      res.json({
        message: "Ürünler başarıyla getirildi.",
        products,
        total: products.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Ürünler getirilemedi.",
      });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const { name, description, priceCents, stock } = req.body;
      const ownerId = req.user?.userId;

      if (!ownerId) {
        return res.status(401).json({
          message: "Kimlik doğrulama gerekli",
        });
      }

      if (!name) {
        return res.status(400).json({
          message: "Ürün adı zorunludur.",
        });
      }

      const product = await ProductService.createProduct({
        name,
        description,
        priceCents,
        stock,
        ownerId,
      });

      res.json({
        message: "Ürün başarıyla oluşturuldu",
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ürün oluşturulamadı",
      });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, priceCents, stock } = req.body;
      const product = await ProductService.getProductById(id);

      if (req.user?.role !== "admin" && product.ownerId !== req.user?.userId) {
        return res
          .status(403)
          .json({ message: "Bu ürünü güncelleme yetkiniz yok" });
      }

      const updatedProduct = await ProductService.updateProduct({
        id,
        name,
        description,
        priceCents,
        stock,
      });

      res.json({
        message: "Ürün başarıyla güncellendi",
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(404).json({
        message: "Ürün güncellenemedi",
      });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRole = req.user?.role;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Kimlik doğrulama gerekli",
        });
      }
      const product = await ProductService.getProductById(id);
      if (userRole !== "admin" && product.ownerId !== userId) {
        return res.status(403).json({
          message: "Bu ürünü silme yetkiniz yok",
        });
      }

      await ProductService.deleteProduct(id);
      res.json({
        message: "Ürün başarıyla silindi",
        deletedProductId: id,
        deletedBy: userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ürün silinemedi",
      });
    }
  }
}

export default ProductController;
