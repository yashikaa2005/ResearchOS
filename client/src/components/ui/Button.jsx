// client/src/components/ui/Button.jsx
const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
};

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;