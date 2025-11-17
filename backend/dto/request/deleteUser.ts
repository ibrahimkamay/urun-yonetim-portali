export class DeleteUserDTO {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
  validate() {
    if (!this.id) throw new Error("Kullanıcı ID zorunludur.");
  }
}
