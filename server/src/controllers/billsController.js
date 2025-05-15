import Bills from "../models/Bills.js";

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
      userId: req.user.uid,
    });

    await bills.save();

    res.status(201).json({ message: "Bill created successfully", bills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bills.find({ userId: req.user.uid }).populate("category");
    res.json(bills);
  } catch (error) {
    console.error("Erro ao buscar contas:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const getBillById = async (req, res) => {
  try {
    const bill = await Bills.findOne({ _id: req.params.id, userId: req.user.uid }).populate("category");

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
    } = req.body;

    const updatedBill = await Bills.findOneAndUpdate(
      { _id: id, userId: req.user.uid },
      {
        name,
        value,
        installments,
        installmentsPayed,
        isRecurring,
        nextPaymentDate,
        description,
        category,
      },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ error: "Bill not found or unauthorized" });
    }

    res.json({ message: "Bill updated successfully", updatedBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBill = async (req, res) => {
  try {
    const deleted = await Bills.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });

    if (!deleted) {
      return res.status(404).json({ error: "Bill not found or unauthorized" });
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createBills, getBills, getBillById, updateBill, deleteBill };
