export class RegisterRequestDTO {
    username: string;
    email: string;
    password: string;
    role?: "admin" | "user";
    constructor(register: any) {
        this.username = register.username;
        this.email = register.email;
        this.password = register.password;
        this.role = register.role || "user";
    }
     validate() {
    if (!this.username || !this.email || !this.password) {
      throw new Error("Kullanıcı adı, email ve şifre zorunludur.");
    }
    if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      throw new Error("Geçerli bir email giriniz.");
    }
    if (this.password.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalı.");
    }
    if (this.role && !["admin", "user"].includes(this.role)) {
      throw new Error("Geçersiz rol. Sadece 'admin' veya 'user' olabilir.");
    }
  }
}