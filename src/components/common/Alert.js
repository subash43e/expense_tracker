import PropTypes from "prop-types";

/**
 * Reusable alert/message component for success and error messages
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 * @param {boolean} showIcon - Whether to show an icon (default: false)
 */
export default function Alert({ type = "success", message, showIcon = false }) {
  if (!message) return null;

  const baseClasses = "p-4 mb-4 text-sm rounded-lg border";
  
  const typeClasses = {
    success: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800",
    error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800",
  };

  const SuccessIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ErrorIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {showIcon ? (
        <div className="flex items-center gap-2">
          {type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          <span className="font-medium">{message}</span>
        </div>
      ) : (
        <span>{message}</span>
      )}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  message: PropTypes.string,
  showIcon: PropTypes.bool,
};
