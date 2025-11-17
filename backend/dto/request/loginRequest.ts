export class LoginRequestDTO {
    email: string;
    password:string;
    constructor(login: any) {
        this.email = login.email;
        this.password = login.password;
    }
    validate() {
    if (!this.email || !this.password) {
      throw new Error("Email veya kullanıcı adı ve şifre zorunludur.");
    }
    if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
      throw new Error("Geçerli bir email giriniz.");
    }
    if (this.password.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalı.");
    }
  }
 }