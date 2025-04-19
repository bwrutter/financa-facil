import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    nome: {
        type: String, //exemplo: Alimentação, Transporte, Saúde, Streaming
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
