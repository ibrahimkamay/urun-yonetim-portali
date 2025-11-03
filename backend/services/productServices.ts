import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProductService {
  static async getAllProduct() {
    return await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    });
  }
  static async createProduct(data: {
    name: string;
    description: string;
    priceCents: number;
    stock: number;
    ownerId: number;
  }) {
    const { name, description, priceCents, stock, ownerId } = data;
    return await prisma.product.create({
      data: {
        name,
        description,
        priceCents,
        stock,
        ownerId,
      },
    });
  }

  static async getProductById(productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt:null },
    });
    if (!product) {
      throw new Error("Ürün bulunamadı");
    }
    return product;
  }


  static async updateProduct(data: {
    id: string,
    name: string,
    description: string,
    priceCents: number,
    stock: number,
  }) {
    const { id, name, description,priceCents,stock } = data;
    const product = await prisma.product.findFirst({
      where: { id, deletedAt:null },
    });

    if (!product) {
      throw new Error("Ürün bulunamadı");
    }
    return await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        priceCents,
        stock,
      },
      select: {
        name: true,
        description: true,
        priceCents: true,
        stock: true
      },
    });
  }
  static async deleteProduct(productId: string) {
    const existingProduct = await prisma.product.findFirst({
      where: { id: productId, deletedAt:null },
    });
    if (!existingProduct) {
      throw new Error("Ürün Bulunamadı");
    }

   return await prisma.product.update({
      where: { id:productId },
      data: { deletedAt: new Date() },
    });
  }
}

export default ProductService;
