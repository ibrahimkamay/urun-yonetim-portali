import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
      where: {deletedAt: null},
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });

      res.json({
        message: "Tüm kullanıcılar",
        users,
        total: users.length,
        requestedBy: req.user?.userId
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        error: "Kullanıcılar getirilemedi."
      });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const requestingUser = req.user;

      if (!requestingUser) {
        return res.status(401).json({
          message: "Kimlik doğrulama gerekli"
        });
      }

      if (requestingUser.role !== 'admin' && requestingUser.userId !== parseInt(userId)) {
        return res.status(403).json({
          message: "Sadece kendi profilinizi görebilirsiniz"
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: {
              id: true,
              name: true,
              createdAt: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      res.json({
        message: "Profil bilgileri",
        user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Profil getirilemedi" });
    }
  }

  static async createUser(req: Request, res:Response) {
    try {
      const {username, email, password, role} = req.body;
      if(!username || !password || !email) {
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
    const checkEmail = await prisma.user.findUnique({
      where: {email}
    })
    if (checkEmail) {
      return res.status(400).json({
        message: "Bu email zaten kayıtlı."
      })
    }

   const hashPassword = await bcrypt.hash(password, 12);
   const user = await prisma.user.create({
    data:{
      name: username,
      email,
      password: hashPassword,
      role
    }
   })
   return res.status(201).json({
     message: "Kullanıcı başarıyla oluşturuldu",
     user,
   })

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
          message: "Geçersiz rol. Sadece 'admin' veya 'user' olabilir"
        });
      }

      if (req.user?.userId === parseInt(userId)) {
        return res.status(400).json({
          message: "Kendi rolünüzü değiştiremezsiniz"
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });

      res.json({
        message: "Kullanıcı rolü güncellendi",
        user: updatedUser,
        updatedBy: req.user?.userId
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
          message: "Kendi kendini silemezsin"
        });
      }

      const deletedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          deletedAt: new Date()
        }
      });

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