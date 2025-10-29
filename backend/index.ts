import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
dotenv.config();
const app:Application = express();

// CORS middleware önce gelir
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(201).json({
        "message": "true"
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/dashboard", dashboardRoutes);

const port = process.env.PORT || 8002;
//server'ı başlat.
app.listen(port, () => {
    console.log(`Server şurada başlatıldı. ${port}`);
})