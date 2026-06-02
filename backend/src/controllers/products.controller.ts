import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../services/products.service';

const service = new ProductsService();

export class ProductsController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const data = await service.findById(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, error: 'Produto não encontrado' });
        return;
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json({ success: true, data });
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
