import 'express-async-errors';
import Bills from "../models/Bills.js";
import Joi from 'joi';

const billSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  value: Joi.number().positive().required(),
  installments: Joi.number().integer().min(1).optional().default(1),
  installmentsPayed: Joi.number().integer().min(0).optional().default(0),
  isRecurring: Joi.boolean().optional().default(false),
  recurrenceType: Joi.string().valid('monthly', 'yearly', 'weekly', 'daily').when('isRecurring', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  recurrenceDay: Joi.number().min(1).max(31).when('recurrenceType', {
    is: 'monthly',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  nextPaymentDate: Joi.date().iso().optional().allow(null),
  lastPaymentDate: Joi.date().iso().optional().allow(null),
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

// Novo método para processar pagamentos recorrentes
const processRecurringPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bill = await Bills.findOne({ _id: id, userId: req.user.uid });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found or unauthorized" });
    }

    if (!bill.isRecurring) {
      return res.status(400).json({ error: "This bill is not recurring" });
    }

    // Atualiza a data do último pagamento
    bill.lastPaymentDate = bill.nextPaymentDate || new Date();
    // Calcula a próxima data de pagamento
    bill.nextPaymentDate = bill.calculateNextPaymentDate();

    await bill.save();

    res.json({
      message: "Recurring payment processed successfully",
      bill,
      nextPaymentDate: bill.nextPaymentDate
    });
  } catch (error) {
    next(error);
  }
};

// Novo método para listar contas recorrentes próximas do vencimento
const getUpcomingRecurringBills = async (req, res, next) => {
  try {
    const daysAhead = parseInt(req.query.days) || 7;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const bills = await Bills.find({
      userId: req.user.uid,
      isRecurring: true,
      nextPaymentDate: {
        $gte: new Date(),
        $lte: futureDate
      }
    }).populate("category");

    res.json(bills);
  } catch (error) {
    next(error);
  }
};

export {
  createBills,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  processRecurringPayment,
  getUpcomingRecurringBills
};