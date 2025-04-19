import PaymentForm from '../models/PaymentForm.js';

const createPaymentForm = async (req, res) => {
    try {
        const { nome, tipo, instituicao, usuarioId } = req.body;
        const forma = new PaymentForm({ nome, tipo, instituicao, usuarioId });
        await forma.save();
        res.status(201).json({ message: 'Forma de pagamento criada com sucesso', forma });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar forma de pagamento' });
    }
};

const getPaymentForm = async (req, res) => {
    try {
        const formas = await PaymentForm.find();
        res.json(formas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar formas de pagamento' });
    }
};

export { createPaymentForm, getPaymentForm };
