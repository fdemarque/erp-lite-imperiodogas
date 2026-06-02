import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller.js';

const router = Router();
const controller = new OrdersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
