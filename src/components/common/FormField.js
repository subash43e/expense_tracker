import PropTypes from "prop-types";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  options = [],
  required = false,
  variant = "compact",
  inputProps = {},
}) {
  const isSpacious = variant === "spacious";

  const labelClasses = isSpacious
    ? "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
    : "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1";

  const inputBaseClasses = isSpacious
    ? "w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-lg focus:ring-2 focus:ring-opacity-50 p-3 text-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
    : "w-full bg-gray-50 dark:bg-gray-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 h-10";

  const errorBorderClasses = error
    ? isSpacious
      ? "border-red-500 dark:border-red-400 focus:ring-red-500"
      : "border-red-500 dark:border-red-400"
    : isSpacious
      ? "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
      : "border-gray-300 dark:border-gray-600";

  const inputClasses = `${inputBaseClasses} ${errorBorderClasses}`;

  const errorClasses = isSpacious
    ? "text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1"
    : "text-red-600 dark:text-red-400 text-xs mt-1";

  const ErrorIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div>
      <label className={labelClasses} htmlFor={name}>
        {label}
      </label>
      
      {type === "select" ? (
        <select
          className={inputClasses}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          {...inputProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={inputClasses}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...inputProps}
        />
      ) : (
        <input
          className={inputClasses}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...inputProps}
        />
      )}

      {error && (
        <p className={errorClasses}>
          {isSpacious && <ErrorIcon />}
          {error}
        </p>
      )}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  required: PropTypes.bool,
  variant: PropTypes.oneOf(["compact", "spacious"]),
  inputProps: PropTypes.object,
};
