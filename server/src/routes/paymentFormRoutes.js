import express from 'express';
import { createPaymentForm, getPaymentForm } from '../controllers/paymentFormController.js';

const router = express.Router();

router.post('/', createPaymentForm);
router.get('/', getPaymentForm);

export default router;