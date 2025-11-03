import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


class DashboardServices {

    static async getTotalUsers() {
        return await prisma.user.count();
    }
    static async getTotalProducts() {
        return prisma.product.count();
    }
    static async getActiveProducts() {
        return prisma.product.count({ where: { isActive: true } })
    }
    static async getLowStockProducts() {
        return prisma.product.count({ where: { stock: { lt: 10 }, isActive: true } })
    }
    static async getRecentUsers () {
        return prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
    }
    static async getUsersByRole() {
    return await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });
  }

  static async getRecentProducts () {
    return prisma.product.findMany({
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
        })
  }
  static async getAllDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      activeProducts,
      lowStockProducts,
      recentUsers,
      recentProducts,
      usersByRole
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalProducts(),
      this.getActiveProducts(),
      this.getLowStockProducts(),
      this.getRecentUsers(),
      this.getRecentProducts(),
      this.getUsersByRole()
    ]);

    return {
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
    };
  }
}

export default DashboardServices;