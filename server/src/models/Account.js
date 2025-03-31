import mongoose from 'mongoose';

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
}, { timestamps: true });

export default mongoose.model('Account', AccountSchema);