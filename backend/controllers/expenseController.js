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

export async function getAllExpense(req, res) {
  const userId = req.user._id;
  try {
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;
  try {
    const updateexpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updateexpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updateexpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const expense = await expenseModel.findOneAndDelete({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
