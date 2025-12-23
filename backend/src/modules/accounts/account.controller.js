import {
  createAccount,
  listAccountsByUser,
  deleteAccount,
} from "./account.service.js";

export async function store(req, res) {
  const { name, type, balance } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      message: "Nome e tipo são obrigatórios",
    });
  }

  const account = await createAccount({
    name,
    type,
    balance,
    userId: req.userId,
  });

  return res.status(201).json(account);
}

export async function index(req, res) {
  const accounts = await listAccountsByUser(req.userId);
  return res.json(accounts);
}

export async function remove(req, res) {
  const { id } = req.params;

  const deleted = await deleteAccount(id, req.userId);

  if (!deleted) {
    return res.status(404).json({ message: "Conta não encontrada" });
  }

  return res.status(204).send();
}
