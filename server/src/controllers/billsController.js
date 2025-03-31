import Bills from '../models/Bills.js';

const createBills = async (req, res) => {
    try {
        const { name, value, installments, isRecurring, nextPaymentDate, description } = req.body;

        const bills = new Bills({ name, value, installments, isRecurring, nextPaymentDate, description });
        await bills.save();

        res.status(201).json({ message: 'Bill created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBills = async (req, res) => {
    try {
        const accounts = await Bills.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBillById = async (req, res) => {
    try {
        const account = await Bills.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ error: 'Bill not encontred' });
        }

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        await Bills.findByIdAndDelete(id);
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { createBills, getBills, getBillById, deleteBill };
