import "dotenv/config";
import dbConnect from "../config/db.js";
import Category from "../models/Category.js";
import Bills from "../models/Bills.js";

await dbConnect();

const runSeed = async () => {
  try {
    // Limpa dados antigos, descomente se quiser resetar a base antes do seed
    // await Category.deleteMany();
    // await Bills.deleteMany();

    const firebaseUid = "123456";

    const categories = await Category.insertMany([
      { name: "Streaming", userId: firebaseUid },
      { name: "Alimentação", userId: firebaseUid },
      { name: "Transporte", userId: firebaseUid },
    ]);

    console.log("Categories inserted:");
    console.table(categories.map(({ name, _id }) => ({ name, _id })));

    const contas = await Bills.insertMany([
      {
        name: "Netflix",
        value: 30,
        installments: 0,
        installmentsPayed: 0,
        isRecurring: true,
        nextPaymentDate: new Date("2025-04-19"),
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
        nextPaymentDate: new Date("2025-04-25"),
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
        nextPaymentDate: new Date("2025-04-19"),
        description: "Uber para o trabalho",
        category: categories[2]._id,
        userId: firebaseUid,
      },
    ]);

    console.log("\nBills inserted:");
    console.table(
      contas.map(({ name, _id, category }) => ({
        name,
        _id,
        category: category.toString(),
      }))
    );

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error running seed:", error);
    process.exit(1);
  }
};

runSeed();
