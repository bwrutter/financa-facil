import Category from '../models/Category.js';

const createCategory = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const category = new Category({ name, userId });
        await category.save();
        res.status(201).json({ message: 'category criada com sucesso', category });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar category' });
    }
};

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error('Erro ao buscar categories:', error.message);
        res.status(500).json({ error: 'Erro ao buscar categories' });
    }
};

export { createCategory, getCategory };
