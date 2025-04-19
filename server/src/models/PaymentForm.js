import mongoose from 'mongoose';

const PaymentFormSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: String, // exemplo: "cartão de crédito", "cartão de débito", "transferência", "boleto", "dinheiro"
        required: true
    },
    instituicao: {
        type: String, // exemplo: "Banco do Brasil", "Itaú", "Caixa Econômica"
        required: false
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('PaymentForm', PaymentFormSchema);
