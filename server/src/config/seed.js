import "dotenv/config";
import dbConnect from "../config/db.js";
import Category from "../models/Category.js";
import Bills from "../models/Bills.js";

await dbConnect();

const runSeed = async () => {
  try {
    // Deleta se precisar
    // await Category.deleteMany();
    // await Bill.deleteMany();

    const firebaseUid = "123456";

    const categories = await Category.insertMany([
      { name: "Streaming", userId: firebaseUid },
      { name: "Alimentação", userId: firebaseUid },
      { name: "Transporte", userId: firebaseUid },
    ]);

    console.log("Categories:");
    console.log(categories.map((c) => ({ name: c.name, _id: c._id })));

    const contas = await Bills.insertMany([
      {
        name: "Netflix",
        value: 30,
        installments: 0,
        installmentsPayed: 0,
        isRecurring: true,
        nextPaymentDate: "2025-04-19",
        description: "Teste",
        category: categories[0]._id,
        userId: firebaseUid,
      },
      {
        name: "Alimentação",
        value: 150,
        installments: 1,
        installmentsPayed: 0,
        isRecurring: false,
        nextPaymentDate: "2025-04-25",
        description: "Texas Burger",
        category: categories[1]._id,
        userId: firebaseUid,
      },
      {
        name: "Uber",
        value: 80,
        installments: 0,
        installmentsPayed: 0,
        isRecurring: true,
        nextPaymentDate: "2025-04-19",
        description: "Uber para o trabalho",
        category: categories[2]._id,
        userId: firebaseUid,
      },
    ]);

    console.log("\nContas (Bills):");
    console.log(
      contas.map((bill) => ({
        name: bill.name,
        _id: bill._id,
        category: bill.category,
      }))
    );

    console.log("\n Dados inseridos com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao rodar seed:", error);
    process.exit(1);
  }
};

runSeed();
