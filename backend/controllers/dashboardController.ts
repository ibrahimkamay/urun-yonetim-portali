import { Request, Response } from "express";
import DashboardServices from "../services/dashboardServices";

class DashboardController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await DashboardServices.getAllDashboardStats();
      res.json({
        message: "İstatsikler",
        stats
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Dashboard verileri getirilemedi"
      });
    }
  }
}

export default DashboardController;