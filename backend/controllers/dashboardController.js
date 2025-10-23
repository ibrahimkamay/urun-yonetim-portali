const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
    try {
        // Paralel sorgular - performanslı
        const [
            totalUsers,
            totalProducts,
            activeProducts,
            lowStockProducts,
            recentUsers,
            recentProducts,
            usersByRole
        ] = await Promise.all([
            // Genel istatistikler
            prisma.user.count(),
            prisma.product.count(),
            prisma.product.count({ where: { isActive: true } }),
            prisma.product.count({ where: { stock: { lt: 10 }, isActive: true } }),
            
            // Son aktiviteler
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            
            prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, priceCents: true, stock: true, isActive: true, createdAt: true,
                    owner: { select: { name: true } }
                }
            }),
            
            // Role dağılımı
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
                    usersByRole: usersByRole.map(item => ({
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
};

module.exports = { getDashboardStats };