import 'express-async-errors';
import Bills from "../models/Bills.js";
import Joi from 'joi';

const billSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  value: Joi.number().positive().required(),
  installments: Joi.number().integer().min(1).optional().default(1),
  installmentsPayed: Joi.number().integer().min(0).optional().default(0),
  isRecurring: Joi.boolean().optional().default(false),
  nextPaymentDate: Joi.date().iso().optional().allow(null),
  description: Joi.string().trim().optional().allow(''),
  category: Joi.string().hex().length(24).optional(),
});

const createBills = async (req, res, next) => {
  try {
    const { error, value } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const bills = new Bills({
      ...value,
      userId: req.user.uid,
    });

    await bills.save();

    res.status(201).json({ message: "Bill created successfully", bills });
  } catch (error) {
    next(error);
  }
};

const getBills = async (req, res, next) => {
  try {
    const bills = await Bills.find({ userId: req.user.uid }).populate("category");
    res.json(bills);
  } catch (error) {
    next(error);
  }
};

const getBillById = async (req, res, next) => {
  try {
    const bill = await Bills.findOne({ _id: req.params.id, userId: req.user.uid }).populate("category");

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    next(error);
  }
};

const updateBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedBill = await Bills.findOneAndUpdate(
      { _id: id, userId: req.user.uid },
      value,
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ error: "Bill not found or unauthorized" });
    }

    res.json({ message: "Bill updated successfully", updatedBill });
  } catch (error) {
    next(error);
  }
};

const deleteBill = async (req, res, next) => {
  try {
    const deleted = await Bills.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });

    if (!deleted) {
      return res.status(404).json({ error: "Bill not found or unauthorized" });
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { createBills, getBills, getBillById, updateBill, deleteBill };