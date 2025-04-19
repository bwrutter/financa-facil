import Bills from '../models/Bills.js';

const createBills = async (req, res) => {
    try {
        const {
            name,
            value,
            installments,
            installmentsPayed,
            isRecurring,
            nextPaymentDate,
            description,
            category,
            paymentForm
        } = req.body;

        const bills = new Bills({
            name,
            value,
            installments,
            installmentsPayed,
            isRecurring,
            nextPaymentDate,
            description,
            category,
            paymentForm
        });

        await bills.save();

        res.status(201).json({ message: 'Bill created successfully', bills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBills = async (req, res) => {
    try {
      const accounts = await Bills.find()
        .populate('category')
        .populate('paymentForm');
  
      res.json(accounts);
    } catch (error) {
      console.error('Erro ao buscar contas:', error.message);
  
      if (error.name === 'StrictPopulateError') {
        return res.status(400).json({ error: `${error.message}` });
      }
  
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  };

const getBillById = async (req, res) => {
    try {
        const account = await Bills.findById(req.params.id)
            .populate('category')
            .populate('paymentForm');

        if (!account) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            value,
            installments,
            installmentsPayed,
            isRecurring,
            nextPaymentDate,
            description,
            category,
            paymentForm
        } = req.body;

        const updatedBill = await Bills.findByIdAndUpdate(
            id,
            {
                name,
                value,
                installments,
                installmentsPayed,
                isRecurring,
                nextPaymentDate,
                description,
                category,
                paymentForm
            },
            { new: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        res.json({ message: 'Bill updated successfully', updatedBill });
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

export { createBills, getBills, getBillById, updateBill, deleteBill };
