export class ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;

  constructor(product: any) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.priceCents / 100;  // cent'ten TL'ye çevir
    this.stock = product.stock;
  }
}