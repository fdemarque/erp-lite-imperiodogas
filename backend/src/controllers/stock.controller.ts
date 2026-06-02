import { Request, Response, NextFunction } from 'express';
import { StockService } from '../services/stock.service';

const service = new StockService();

export class StockController {
  async getCurrentStock(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getCurrentStock();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getStockHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { nf, truck_plate, product_id } = req.query;
      const data = await service.getStockHistory({ 
        nf: nf as string, 
        truck_plate: truck_plate as string, 
        product_id: product_id as string 
      });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
