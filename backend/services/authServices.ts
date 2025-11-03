import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

class AuthService {
    static register = async (data: {
        username: string;
        email: string;
        password: string;
        role?: "admin" | "user";
    }) => {
        const { username, email, password, role } = data;
        const hashPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name: username,
                email,
                password: hashPassword,
                role: role || "user",
            },
        });
        const { password: _password, ...noPass } = user;
        return noPass;
    };
    static findUserByEmail = async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    };
    static login = async (email: string, password: string) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) {
            throw new Error("Email veya şifre hatalı")
        }
        const isMatch = await bcrypt.compare(password, user.password as string)
        if(!isMatch) {
            throw new Error ("Email veya şifre hatalı")
        }
        const token = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: "7d"})
        const {password: _password, ...noPass} = user;
        return {
            token,
            user: noPass,
        }
    };
}

export default AuthService;
