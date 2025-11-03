import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import UserService from "../services/userService";
import AuthService from "../services/authServices";

const prisma = new PrismaClient();

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        message: "Tüm kullanıcılar",
        users,
        total: users.length,
        requestedBy: req.user?.userId,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Kullanıcılar getirilemedi.",
      });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const requestingUser = req.user;

      if (!requestingUser) {
        return res.status(401).json({
          message: "Kimlik doğrulama gerekli",
        });
      }

      if (
        requestingUser.role !== "admin" &&
        requestingUser.userId !== parseInt(userId)
      ) {
        return res.status(403).json({
          message: "Sadece kendi profilinizi görebilirsiniz",
        });
      }

      const user = await UserService.getUsersById(userId);
      res.json({
        message: "Profil bilgileri",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Profil getirilemedi" });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({
          error: "username, password ve email zorunludur.",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Geçerli bir email adresi girin",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          error: "Şifre en az 6 karakter olmalıdır",
        });
      }
      if (role && !["admin", "user"].includes(role)) {
        return res.status(400).json({
          error: "Geçersiz rol",
        });
      }
      const user = await UserService.createUser({
        username,
        email,
        password,
        role,
      });
      return res.status(201).json({
        message: "Kullanıcı başarıyla oluşturuldu",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Bir hata oluştu",
      });
    }
  }

  static async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
          message: "Geçersiz rol. Sadece 'admin' veya 'user' olabilir",
        });
      }

      if (req.user?.userId === parseInt(userId)) {
        return res.status(400).json({
          message: "Kendi rolünüzü değiştiremezsiniz",
        });
      }

      const updatedUser = UserService.updateUser(userId, role);

      res.json({
        message: "Kullanıcı rolü güncellendi",
        user: updatedUser,
        updatedBy: req.user?.userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Rol güncellenemedi" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (req.user?.userId === parseInt(userId)) {
        return res.status(400).json({
          message: "Kendi kendini silemezsin",
        });
      }

      const deletedUser = UserService.deleteUser(userId);

      res.json({
        message: "Kullanıcı silindi",
        user: deletedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kullanıcı silinemedi" });
    }
  }
}

export default UserController;
