import { Request, Response } from "express";
import DashboardServices from "../services/dashboardServices";
import {DashboardResponseDTO} from "../dto/response/dashboardResponse"

class DashboardController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await DashboardServices.getAllDashboardStats();
      const responseDTO = new DashboardResponseDTO(stats);
      res.json({
        message: "İstatsikler",
        ...responseDTO
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