import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';

const router = Router();
const controller = new ProductsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
