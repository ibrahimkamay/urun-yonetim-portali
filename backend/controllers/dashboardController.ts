import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class DashboardController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        totalProducts,
        activeProducts,
        lowStockProducts,
        recentUsers,
        recentProducts,
        usersByRole
      ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { stock: { lt: 10 }, isActive: true } }),
        
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, email: true, role: true, createdAt: true }
        }),
        
        prisma.product.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, 
            name: true, 
            priceCents: true, 
            stock: true, 
            isActive: true, 
            createdAt: true,
            owner: { select: { name: true } }
          }
        }),
        
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        })
      ]);

      res.json({
        message: "Dashboard istatistikleri",
        stats: {
          overview: {
            totalUsers,
            totalProducts,
            activeProducts,
            lowStockProducts
          },
          recent: {
            users: recentUsers,
            products: recentProducts
          },
          charts: {
            usersByRole: usersByRole.map((item: any) => ({
              role: item.role,
              count: item._count.role
            }))
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Dashboard verileri getirilemedi"
      });
    }
  }
}

export default DashboardController;