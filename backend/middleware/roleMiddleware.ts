import { Request, Response, NextFunction } from "express";

class RoleMiddleware {
  static authorize(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Giriş yapmanız gerekiyor"
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Bu işlem için yetkiniz bulunmuyor"
        });
      }

      next();
    };
  }
}

export default RoleMiddleware;