
export function validateExpenseForm({ description, amount, category, date }) {
  const errors = {};

  // Validate description
  if (!description || !description.trim()) {
    errors.description = "Description is required";
  } else if (description.trim().length < 3) {
    errors.description = "Description must be at least 3 characters";
  }

  // Validate amount
  if (!amount && amount !== 0) {
    errors.amount = "Amount is required";
  } else if (isNaN(amount) || parseFloat(amount) <= 0) {
    errors.amount = "Amount must be a positive number";
  } else if (parseFloat(amount) > 1000000) {
    errors.amount = "Amount cannot exceed $1,000,000";
  }

  // Validate category
  if (!category || !category.trim()) {
    errors.category = "Category is required";
  } else if (category.trim().length < 2) {
    errors.category = "Category must be at least 2 characters";
  }

  // Validate date
  if (!date) {
    errors.date = "Date is required";
  }

  return errors;
}


export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
