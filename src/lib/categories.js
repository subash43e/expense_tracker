// Predefined expense categories
export const EXPENSE_CATEGORIES = [
  { value: "Food", label: "🍔 Food & Dining", icon: "🍔" },
  { value: "Transportation", label: "🚗 Transportation", icon: "🚗" },
  { value: "Shopping", label: "🛍️ Shopping", icon: "🛍️" },
  { value: "Entertainment", label: "🎭 Entertainment", icon: "🎭" },
  { value: "Bills", label: "💡 Bills & Utilities", icon: "💡" },
  { value: "Healthcare", label: "🏥 Healthcare", icon: "🏥" },
  { value: "Education", label: "📚 Education", icon: "📚" },
  { value: "Travel", label: "✈️ Travel", icon: "✈️" },
  { value: "Housing", label: "🏠 Housing", icon: "🏠" },
  { value: "Insurance", label: "🛡️ Insurance", icon: "🛡️" },
  { value: "Subscriptions", label: "📱 Subscriptions", icon: "📱" },
  { value: "Fitness", label: "💪 Fitness & Gym", icon: "💪" },
  { value: "Gifts", label: "🎁 Gifts & Donations", icon: "🎁" },
  { value: "Personal", label: "👤 Personal Care", icon: "👤" },
  { value: "Other", label: "📦 Other", icon: "📦" },
];

/**
 * Get the icon for a given category value.
 * @param {string} categoryValue - The value of the category.
 * @returns {string} - The icon associated with the category, or a default icon.
 */
export const getCategoryIcon = (categoryValue) => {
  return (
    EXPENSE_CATEGORIES.find((cat) => cat.value === categoryValue)?.icon || "📦"
  );
};

/**
 * Get the label for a given category value.
 * @param {string} categoryValue - The value of the category.
 * @returns {string} - The label associated with the category, or the category value itself.
 */
export const getCategoryLabel = (categoryValue) => {
  return (
    EXPENSE_CATEGORIES.find((cat) => cat.value === categoryValue)?.label ||
    categoryValue
  );
};
