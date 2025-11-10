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

export const getCategoryIcon = (categoryValue) => {
  return (
    EXPENSE_CATEGORIES.find((cat) => cat.value === categoryValue)?.icon || "📦"
  );
};

export const getCategoryLabel = (categoryValue) => {
  return (
    EXPENSE_CATEGORIES.find((cat) => cat.value === categoryValue)?.label ||
    categoryValue
  );
};
