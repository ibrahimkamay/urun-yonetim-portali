import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        include: {
          owner: {
            select: { name: true, email: true }
          }
        }
      });

      res.json({
        message: "Ürünler başarıyla getirildi.",
        products,
        total: products.length
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Ürünler getirilemedi."
      });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const { name, description, priceCents, stock } = req.body;
      const ownerId = req.user?.userId;

      if (!ownerId) {
        return res.status(401).json({
          message: "Kimlik doğrulama gerekli"
        });
      }

      if (!name) {
        return res.status(400).json({
          message: "Ürün adı zorunludur."
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          priceCents,
          stock,
          ownerId,
        }
      });

      res.json({
        message: "Ürün başarıyla oluşturuldu",
        product
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ürün oluşturulamadı"
      });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      if (req.user?.role !== 'admin' && product.ownerId !== req.user?.userId) {
        return res.status(403).json({ message: "Bu ürünü güncelleme yetkiniz yok" });
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description
        },
        select: {
          name: true,
          description: true,
        }
      });

      res.json({
        message: "Ürün başarıyla güncellendi",
        product: updatedProduct
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ürün güncellenemedi"
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
          message: "Kimlik doğrulama gerekli"
        });
      }

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      if (userRole !== "admin" && existingProduct.ownerId !== userId) {
        return res.status(403).json({
          message: "Bu ürünü silme yetkiniz yok",
        });
      }

      await prisma.product.delete({
        where: { id },
      });

      res.json({
        message: "Ürün başarıyla silindi",
        deletedProductId: id,
        deletedBy: userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "Ürün silinemedi"
      });
    }
  }
}

export default ProductController;