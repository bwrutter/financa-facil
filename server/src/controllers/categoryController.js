import Category from "../models/Category.js";

const createCategory = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const category = new Category({ name, userId });
    await category.save();
    res.status(201).json({ message: "category criada com sucesso", category });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar category" });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categories:", error.message);
    res.status(500).json({ error: "Erro ao buscar categories" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categories = await Category.findById(req.params.id);

    if (!categories) {
      return res.status(404).json({ error: "categories not found" });
    }

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, userId } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, {
      name,
      userId,
    });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
