export class DashboardResponseDTO {
  overview: {
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
  };
  recent: {
    users: any[];
    products: any[];
  };
  charts: {
    usersByRole: Array<{ role: string; count: number }>;
  };

  constructor(data: any) {
    this.overview = {
      totalUsers: data.overview.totalUsers,
      totalProducts: data.overview.totalProducts,
      activeProducts: data.overview.activeProducts,
      lowStockProducts: data.overview.lowStockProducts,
    };
    this.recent = {
      users: data.recent.users,
      products: data.recent.products,
    };
    this.charts = {
      usersByRole: data.charts.usersByRole,
    };
  }
}