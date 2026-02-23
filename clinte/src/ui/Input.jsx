import clsx from "clsx";

const Input = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={clsx(
          "w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-purple-500",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
