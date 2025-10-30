import { PrismaClient } from "@prisma/client";
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