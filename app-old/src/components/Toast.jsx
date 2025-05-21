import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
};

const Toast = ({ message, type = "info", visible }) => {
  if (!visible) return null;

  const typeClass = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  return (
    <div className="toast toast-bottom toast-center">
      <div
        className={`alert ${typeClass[type]} shadow-lg px-6 py-4 rounded-xl text-lg flex items-center gap-4 animate-fadeIn`}
      >
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
