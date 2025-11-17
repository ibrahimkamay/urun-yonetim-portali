export class CreateProductDTO {
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  ownerId: number;

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.priceCents = typeof data.priceCents === "string" ? Number(data.priceCents) : data.priceCents;
    this.stock = typeof data.stock === "string" ? Number(data.stock) : data.stock;
    this.ownerId = typeof data.ownerId === "string" ? Number(data.ownerId) : data.ownerId;
    this.ownerId = data.ownerId;
  }
    validate() {
    if (!this.ownerId) {
      throw new Error("Kimlik doğrulama gerekli");
    }

    if (!this.name || this.name.trim() === "") {
      throw new Error("Ürün adı zorunludur");
    }

    if (this.priceCents === undefined || isNaN(this.priceCents) || this.priceCents < 0) {
      throw new Error("Geçerli bir fiyat girin (0 veya üstü)");
    }

    if (this.stock === undefined || isNaN(this.stock) || this.stock < 0) {
      throw new Error("Geçerli bir stok girin (0 veya üstü)");
    }
  }
}
