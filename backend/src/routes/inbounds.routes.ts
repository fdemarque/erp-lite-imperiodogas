import { Router } from 'express';
import { InboundsController } from '../controllers/inbounds.controller';

const router = Router();
const controller = new InboundsController();

router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
