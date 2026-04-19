import incomeModel from "../model/incomeModel.js";

export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newIncome = new incomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllIncome(req, res) {
  const userId = req.user._id;
  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      income,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;
  try {
    const updateIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updateIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updateIncome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const income = await incomeModel.findOneAndDelete({ _id: id, userId });
    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
