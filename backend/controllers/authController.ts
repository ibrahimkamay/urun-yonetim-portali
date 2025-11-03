import AuthService from "../services/authServices"
import { Request, Response } from "express";


class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { username, password, email, role = 'user' } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({
          error: "username, password ve email zorunludur."
        })
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Geçerli bir email adresi girin"
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          error: "Şifre en az 6 karakter olmalıdır"
        });
      }
      if (role && !["admin", "user"].includes(role)) {
        return res.status(400).json({
          error: "Geçersiz rol"
        });
      }
      const existingUser = await AuthService.findUserByEmail(email);
      if(existingUser) {
        return res.status(400).json({
          message: "Bu email zaten kayıtlı",
        })
      }
      const user = await AuthService.register({username, email, password, role});
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Bir hata oluştu",
      });
    }
  }
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const final = await AuthService.login(email, password);
      return res.status(200).json({
        message: "Giriş başarılı",
       ...final
      });


    } catch (error) {
      console.error("Login hatası:", error);
      res.status(500).json({
        message: "giriş yapılırken bir hata oluştu"
      })
    }
  }
}





export default AuthController;