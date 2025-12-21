import { createTransaction, getTransactionsByUser, getAccountBalance } from "./transaction.service.js";

export async function addTransaction(req, res) {
  try {
    const transaction = await createTransaction({ ...req.body, userId: req.userId });
    return res.status(201).json(transaction);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function listTransactions(req, res) {
  try {
    const transactions = await getTransactionsByUser(req.userId);
    return res.json(transactions);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function accountBalance(req, res) {
  try {
    const { accountId } = req.params;
    const balance = await getAccountBalance(req.userId, accountId);
    return res.json({ accountId, balance });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
