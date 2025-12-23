import Transaction from "./transaction.model.js";

export async function createTransaction(data) {
  return await Transaction.create(data);
}

export async function getTransactionsByUser(userId) {
  return await Transaction.find({ userId }).sort({ date: -1 });
}

export async function getAccountBalance(userId, accountId) {
  const transactions = await Transaction.find({ userId, accountId });

  const balance = transactions.reduce((acc, t) => {
    return t.type === "INCOME" ? acc + t.amount : acc - t.amount;
  }, 0);

  return balance;
}
