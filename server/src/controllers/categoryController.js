import Category from "../models/Category.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name, userId: req.user.uid });
    await category.save();
    res.status(201).json({ message: "Category criada com sucesso", category });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.uid });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findOne({ _id: id, userId: req.user.uid });
    if (!category) {
      return res.status(403).json({ error: "Acesso negado ou categoria não encontrada" });
    }

    category.name = name;
    await category.save();

    res.json({ message: "Categoria atualizada", category });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Categoria não encontrada ou não autorizada" });
    }

    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
};