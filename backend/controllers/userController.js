const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({
            message: "Tüm kullanıcılar",
            users,
            total: users.length,
            requestedBy: req.user.userId
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: "Kullanıcılar getirilemedi."
        })
    }

}

const createUserProfile = (req, res) => {
    

}

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUser = req.user;

        // Eğer admin değilse, sadece kendi profilini görebilir
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
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;  // Route'ta :userId kullanıyoruz
        const { role } = req.body;

        // Rol validasyonu
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({
                message: "Geçersiz rol. Sadece 'admin' veya 'user' olabilir"
            });
        }

        // Kendi rolünü değiştirme engeli
        if (req.user.userId === parseInt(userId)) {
            return res.status(400).json({
                message: "Kendi rolünüzü değiştiremezsiniz"
            });
        }

        // Veritabanı güncelleme (await ekledik!)
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
            user: updatedUser,  // Değişken adı düzeltildi
            updatedBy: req.user.userId  // Değişken adı düzeltildi
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Rol güncellenemedi" });
    }
};

const deleteUser = async (req, res) => {
    try {
            const {userId} = req.params;
    
    if(req.user.userId === parseInt(userId)) {
        return res.status(400).json({
            message: "kendi kendini silemezsin"
        })
    }

    const deleteUser = await prisma.user.delete({
        where: {id: parseInt(userId)},
        select: {
            id: true,
            email: true,
            name: true,
        }
    })

        res.json({
            message: "Kullanıcı silindi",
            user: deleteUser,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kullanıcı silinemedi" });
    }

}

module.exports = { getAllUsers, getUserProfile, updateUserRole, deleteUser };