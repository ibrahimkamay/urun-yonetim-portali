import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import UserService from "../services/userService";
import AuthService from "../services/authServices";
import { CreateUserDTO } from "../dto/request/createUser";
import { UpdateUserDTO } from "../dto/request/updateUser";
import { DeleteUserDTO } from "../dto/request/deleteUser";
import { UserResponseDTO } from "../dto/response/userResponse";

const prisma = new PrismaClient();

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      const responseDTOs = users.map(user => new UserResponseDTO(user));


      res.status(200).json({
        message: "Tüm kullanıcılar",
        users: responseDTOs,
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
      const responseDTO = new UserResponseDTO(user);

      res.json({
        message: "Profil bilgileri",
        user: responseDTO
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Profil getirilemedi" });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const createDTO = new CreateUserDTO(req.body);
      createDTO.validate();
      const user = await UserService.createUser({
        username: createDTO.username,
        email: createDTO.email,
        password: createDTO.password,
        role: createDTO.role as "admin" | "user",
      });
      const responseDTO = new UserResponseDTO(user);

      return res.status(201).json({
        message: "Kullanıcı başarıyla oluşturuldu",
        responseDTO,
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

      const updateDTO = new UpdateUserDTO({ id: userId, role });
      updateDTO.validate();
      if (req.user?.userId === parseInt(userId)) {
        return res.status(400).json({
          message: "Kendi rolünüzü değiştiremezsiniz",
        });
      }

      const updatedUser = UserService.updateUser(updateDTO.id, updateDTO.role as "admin" | "user");
      const responseDTO = new UserResponseDTO(updatedUser);


      res.json({
        message: "Kullanıcı rolü güncellendi",
        user: responseDTO,
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
      const deleteDTO = new DeleteUserDTO(userId);
      deleteDTO.validate();

      if (req.user?.userId === parseInt(userId)) {
        return res.status(400).json({
          message: "Kendi kendini silemezsin",
        });
      }

      const deletedUser = UserService.deleteUser(deleteDTO.id);
      const responseDTO = new UserResponseDTO(deletedUser);


      res.json({
        message: "Kullanıcı silindi",
        user: responseDTO,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kullanıcı silinemedi" });
    }
  }
}

export default UserController;
