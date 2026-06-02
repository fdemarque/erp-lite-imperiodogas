import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '../services/orders.service';

const service = new OrdersService();

export class OrdersController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.findAll();
      const mappedData = data.map((o: any) => ({
        ...o,
        driver: o.delivery_drivers ? { ...o.delivery_drivers, name: o.delivery_drivers.people?.name || o.delivery_drivers.name } : null,
        delivery_drivers: undefined
      }));
      res.json({ success: true, data: mappedData });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const data = await service.findById(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, error: 'Pedido não encontrado' });
        return;
      }
      const mappedData = {
        ...data,
        driver: (data as any).delivery_drivers ? { ...(data as any).delivery_drivers, name: (data as any).delivery_drivers.people?.name || (data as any).delivery_drivers.name } : null,
        delivery_drivers: undefined
      };
      res.json({ success: true, data: mappedData });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.create(req.body);
      const mappedData = {
        ...data,
        driver: (data as any).delivery_drivers ? { ...(data as any).delivery_drivers, name: (data as any).delivery_drivers.people?.name || (data as any).delivery_drivers.name } : null,
        delivery_drivers: undefined
      };
      res.status(201).json({ success: true, data: mappedData });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const data = await service.update(req.params.id, req.body);
      const mappedData = {
        ...data,
        driver: (data as any).delivery_drivers ? { ...(data as any).delivery_drivers, name: (data as any).delivery_drivers.people?.name || (data as any).delivery_drivers.name } : null,
        delivery_drivers: undefined
      };
      res.json({ success: true, data: mappedData });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
