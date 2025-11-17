import AuthService from "../services/authServices"
import { Request, Response } from "express";
import { LoginRequestDTO } from "../dto/request/loginRequest";
import { RegisterRequestDTO } from "../dto/request/registerRequest";
import { AuthResponseDTO } from "../dto/response/authResponse";

class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const registerDTO = new RegisterRequestDTO(req.body);
      registerDTO.validate();
      const existingUser = await AuthService.findUserByEmail(registerDTO.email);
      if(existingUser) {
        return res.status(400).json({
          message: "Bu email zaten kayıtlı",
        })
      }
      const result = await AuthService.register({
        username: registerDTO.username,
        email: registerDTO.email,
        password: registerDTO.password,
        role: registerDTO.role
      });
      const responseDTO = new AuthResponseDTO(result);
      
      return res.status(201).json({
        message: "Kayıt başarılı",
        ...responseDTO
      });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        error: error.message || "Bir hata oluştu",
      });
    }
  }
  
  static login = async (req: Request, res: Response) => {
    try {
      const loginDTO = new LoginRequestDTO(req.body);
      loginDTO.validate();
      const result = await AuthService.login(loginDTO.email, loginDTO.password);
      const responseDTO = new AuthResponseDTO(result);
      
      return res.status(200).json({
        message: "Giriş başarılı",
        ...responseDTO
      });
    } catch (error: any) {
      console.error("Login hatası:", error);
      return res.status(400).json({
        error: error.message || "Giriş yapılırken bir hata oluştu"
      });
    }
  }
}

export default AuthController;