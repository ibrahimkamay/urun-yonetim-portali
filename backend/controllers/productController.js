const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();


const getAllProducts = async  (req, res) => {
    try {
         const products = await prisma.product.findMany({
        include: {
            owner: {
                select: {name:true, email:true}
            }
        }
    })
    res.json({
        "message": "Ürünler başarıyla getirildi.",
        products,
        "total": products.length
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Ürünler getirilemedi."
        })
        
        
    }
   
}

const createProduct = async (req, res) => {
    try {
           const { name, description, priceCents, stock } = req.body;
    const ownerId = req.user.userId;

    if(!name) {
        return res.status(500).json({
            "message": "Ürün adı zorunludur."
        })
    }
    const product = await prisma.product.create({
        data: {
            name,
            description,
            priceCents,
            stock,
            ownerId,
        }
    })
    res.json({
        "message" : "Ürünler başarıyla oluşturuldu",
        product
    })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
 
}
const updateProduct = async (req, res) => {
   try {
     const {id} = req.params;
    const {name, description} = req.body;

    const product = await prisma.product.findUnique({
        where:{id}
    })
    if(!product) {
        return res.status(404).json({message: "Ürün bulunamadı"})
    }

    if(req.user.role !== 'admin' && product.ownerId !== req.user.userId ) {
        return res.status(403).json({message: "Bu ürünü güncelleme yetkiniz yok"})
    }
    
    const updateProduct = await prisma.product.update({
        where:({id}),
        data:({
            name,
            description
        }),
        select:({
            name:true,
            description:true,
        })
    })
    res.json({
        message: "ürün başarıyla güncellendi",
        updateProduct
    })
   } catch (error) {
    res.status(500).json({
        "message": error,
    })
   }

}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.userId; // ✅ düzeltildi: userId yerine req.user.userId

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    if (userRole !== "admin" && existingProduct.ownerId !== userId) {
      return res.status(403).json({
        message: "Bu ürünü silme yetkiniz yok",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Ürün başarıyla silindi",
      deletedProductId: id,
      deletedBy: userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu", error });
  }
};


module.exports = {getAllProducts, createProduct,updateProduct, deleteProduct };