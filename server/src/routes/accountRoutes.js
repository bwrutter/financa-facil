import express from 'express';
import { createAccount, getAccounts, getAccountById, deleteAccount } from '../controllers/accountController.js';

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.delete('/:id', deleteAccount);

export default router;
