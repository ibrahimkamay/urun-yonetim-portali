const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  try {
    const { username, password, email, role = 'user' } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({
        error: "username, password ve email zorunludur."
      })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Geçerli bir email adresi girin"
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: "Şifre en az 6 karakter olmalıdır"
      });
    }
    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({
        error: "Geçersiz rol"
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({
        error: `Bu ${email} zaten kayıtlı.`
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashPassword,
        role
      }
    })
    return res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Bir hata oluştu",
    });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return res.status(401).json({
        "message": "Bu kullanıcı hatalı"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        "message": `Invalid`
      })
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '7d',
    });
    return res.status(200).json({ 
      message: "Giriş başarılı",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });


  } catch (error) {
    console.error("Login hatası:", error);
    res.status(500).json({
      message: "giriş yapılırken bir hata oluştu"
    })
  }
}


module.exports = { register, login };