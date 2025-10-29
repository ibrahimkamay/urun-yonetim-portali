import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class AuthMiddleware {
  static authenticateToken = (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Geçersiz token"
    });
  }
  }
}


export default AuthMiddleware;