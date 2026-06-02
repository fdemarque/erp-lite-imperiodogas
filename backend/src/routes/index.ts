import { Router } from 'express';
import peopleRoutes from './people.routes.js';
import clientsRoutes from './clients.routes.js';
import ordersRoutes from './orders.routes.js';

const router = Router();

router.use('/people', peopleRoutes);
router.use('/clients', clientsRoutes);
router.use('/orders', ordersRoutes);

export default router;
