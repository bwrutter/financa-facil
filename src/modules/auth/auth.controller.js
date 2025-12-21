import bcryptjs from "bcryptjs";
import User from "../../models/User.js";
import { generateToken } from "./token.service.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, email e senha são obrigatórios"
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const hash = await bcryptjs.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
  });

  return res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = generateToken(user);

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
