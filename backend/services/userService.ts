import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class UserService {
  static getAllUsers = async () => {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  };
  static getUsersById = async (userId: string) => {
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
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }
    return user;
  };
  static createUser = async (data: {
    username: string;
    email: string;
    password: string;
    role?: "admin" | "user";
  }) => {
    const { username, email, password, role } = data;
    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (checkEmail) {
      throw new Error("Bu email zaten kayıtlı");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashPassword,
        role: role || "user",
      },
    });
    return user;
  };
  static updateUser = async (userId: string, role: "admin" | "user") => {
    return await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  };
  static deleteUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          deletedAt: new Date(),
        },
      });
  }
}

export default UserService;
