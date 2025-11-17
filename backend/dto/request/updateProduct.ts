export class UpdateProductDTO {
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  id: string;

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.priceCents = typeof data.priceCents === "string" ? Number(data.priceCents) : data.priceCents;
    this.stock = typeof data.stock === "string" ? Number(data.stock) : data.stock;
    this.id = data.id;
  }
 validate() {
  if (!this.id) throw new Error("Ürün id'si gerekli");
  
  if (this.name === undefined && this.description === undefined && 
      this.priceCents === undefined && this.stock === undefined) {
    throw new Error("Güncellenecek en az bir alan gönderilmelidir");
  }

  if (this.priceCents !== undefined && (isNaN(this.priceCents) || this.priceCents < 0)) {
    throw new Error("Geçerli bir fiyat girin (0 veya üstü)");
  }

  if (this.stock !== undefined && (isNaN(this.stock) || this.stock < 0)) {
    throw new Error("Geçerli bir stok girin (0 veya üstü)");
  }
}
}
