import { Router } from 'express';
import peopleRoutes from './people.routes';
import clientsRoutes from './clients.routes';
import ordersRoutes from './orders.routes';
import inboundsRoutes from './inbounds.routes';
import productsRoutes from './products.routes';
import stockRoutes from './stock.routes';

const router = Router();

router.use('/people', peopleRoutes);
router.use('/clients', clientsRoutes);
router.use('/orders', ordersRoutes);
router.use('/inbounds', inboundsRoutes);
router.use('/products', productsRoutes);
router.use('/stock', stockRoutes);

export default router;
