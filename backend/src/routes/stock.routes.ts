import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';

const router = Router();
const controller = new StockController();

router.get('/current', controller.getCurrentStock);
router.get('/history', controller.getStockHistory);

export default router;
