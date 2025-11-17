export class UpdateUserDTO {
  id: string;
  role: string;

  constructor(data: any) {
    this.id = data.id;
    this.role = data.role;
  }
  validate() {
    if (!this.id) {
      throw new Error("Kullanıcı ID zorunludur.");
    }
    if (!["admin", "user"].includes(this.role)) {
      throw new Error("Geçersiz rol. Sadece 'admin' veya 'user' olabilir.");
    }
  }
}
