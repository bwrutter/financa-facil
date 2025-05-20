import express from 'express';
import {
  createBills,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from '../controllers/billsController.js';

import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createBills);
router.get('/', getBills);
router.get('/:id', getBillById);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

export default router;
