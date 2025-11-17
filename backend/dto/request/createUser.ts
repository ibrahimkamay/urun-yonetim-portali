export class CreateUserDTO {
    username: string;
    email: string;
    password: string;
    role?:string;

    constructor (data:any) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || "user";
    }
      validate() {
    if (!this.username || !this.email || !this.password) {
      throw new Error("Kullanıcı adı, email ve şifre zorunludur.");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error("Geçerli bir email adresi girin.");
    }
    
    if (this.password.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalı.");
    }
    
    if (this.role && !["admin", "user"].includes(this.role)) {
      throw new Error("Geçersiz rol. Sadece 'admin' veya 'user' olabilir.");
    }
  }
}