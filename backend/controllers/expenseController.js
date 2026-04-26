import expenseModel from "../model/expenseModel.js";

export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
