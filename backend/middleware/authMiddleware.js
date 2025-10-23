const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];// buraya request headerından gelen aut
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.sendStatus(401); 
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decode; 
    next(); // başarılı olursa route'a geç
  } catch (err) {
    return res.status(401).json({
      message: "Geçersiz token"
    });
  }
};

module.exports = authenticateToken;