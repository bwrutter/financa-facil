import mongoose from 'mongoose';
import { isValidCPF, isValidCNPJ } from '../utils/utils.js';

const AccountSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    documentType: { 
        type: Number, 
        enum: [1, 2], 
        required: true 
    },
    documentNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    documentNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                if (value.length === 11) {
                    return isValidCPF(value);
                } else if (value.length === 14) {
                    return isValidCNPJ(value);
                }
                return false;
            },
            message: props => `${props.value} não é um CPF ou CNPJ válido!`
        }
    }
}, { timestamps: true });

export default mongoose.model('Account', AccountSchema);