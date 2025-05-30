import express from 'express';
import {
  createBills,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  processRecurringPayment,
  getUpcomingRecurringBills
} from '../controllers/billsController.js';

import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createBills);
router.get('/', getBills);
router.get('/upcoming', getUpcomingRecurringBills);
router.get('/:id', getBillById);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);
router.post('/:id/process-payment', processRecurringPayment);

export default router;
