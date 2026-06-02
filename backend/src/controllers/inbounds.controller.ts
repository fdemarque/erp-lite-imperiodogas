import { Request, Response, NextFunction } from 'express';
import { InboundsService } from '../services/inbounds.service';

const service = new InboundsService();

export class InboundsController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.findAll();
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
}
