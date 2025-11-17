import { Request, Response } from "express";
import { CreateProductDTO } from "../dto/request/createProduct";
import { UpdateProductDTO } from "../dto/request/updateProduct";
import { DeleteProductDTO } from "../dto/request/deleteProduct";
import ProductService from "../services/productServices";
import {ProductResponseDTO} from "../dto/response/productResponse";

class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProduct();
      const responseDTOs = products.map(p => new ProductResponseDTO(p));

      res.json({
        message: "Ürünler başarıyla getirildi.",
        products,
        total: responseDTOs.length,
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
      const ownerId = req.user?.userId;
      const createDTO = new CreateProductDTO({ ...req.body, ownerId });
      createDTO.validate();
      const product = await ProductService.createProduct(createDTO);
      const responseDTO = new ProductResponseDTO(product);

      return res.status(201).json({
        message: "Ürün başarıyla oluşturuldu",
        responseDTO,
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
      const updateDTO = new UpdateProductDTO({ ...req.body, id });
      updateDTO.validate();
      const product = await ProductService.getProductById(id);

      if (req.user?.role !== "admin" && product.ownerId !== req.user?.userId) {
        return res
          .status(403)
          .json({ message: "Bu ürünü güncelleme yetkiniz yok" });
      }

      const updatedProduct = await ProductService.updateProduct(updateDTO);
      const responseDTO = new ProductResponseDTO(updatedProduct);

      res.json({
        message: "Ürün başarıyla güncellendi",
        product: responseDTO,
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
      const deleteDTO = new DeleteProductDTO(id);
      deleteDTO.validate();
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

      await ProductService.deleteProduct(deleteDTO.id);
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
