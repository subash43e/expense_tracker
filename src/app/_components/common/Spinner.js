import PropTypes from "prop-types";

export default function Spinner({ size = "md", variant = "inline", color = "white" }) {
  if (variant === "inline") {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-8 w-8",
    };

    const colorClasses = {
      white: "text-white",
      indigo: "text-indigo-600 dark:text-indigo-400",
      blue: "text-blue-600 dark:text-blue-400",
      gray: "text-gray-600 dark:text-gray-400",
    };

    return (
      <svg
        className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.white}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  if (variant === "fullscreen") {
    const colorClasses = {
      indigo: "border-indigo-600 dark:border-indigo-400",
      blue: "border-blue-600 dark:border-blue-400",
      gray: "border-gray-600 dark:border-gray-400",
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${colorClasses[color] || colorClasses.indigo} mx-auto mb-4`}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["inline", "fullscreen"]),
  color: PropTypes.oneOf(["white", "indigo", "blue", "gray"]),
};
