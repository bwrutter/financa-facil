import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';
import accountRoutes from './routes/accountRoutes.js';
import billsRoutes from './routes/billsRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

dbConnect();

app.use('/api/accounts', accountRoutes);
app.use('/api/bills', billsRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
