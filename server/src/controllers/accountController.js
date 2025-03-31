import Account from '../models/Account.js';
import bcrypt from 'bcryptjs';

const createAccount = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAccount = await Account.findOne({ email });
        if (existingAccount) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = new Account({ name, email, password: hashedPassword });
        await account.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().select('-password');
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).select('-password');

        if (!account) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await Account.findByIdAndDelete(id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { createAccount, getAccounts, getAccountById, deleteAccount };
