import { useEffect } from "react";

export default function AlertMessage({ message, type = "success", duration = 5000, onClose }) {
  useEffect(() => {
    if (!message || !duration) return;

    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  // type に応じてクラスを切り替え (例: alert-success, alert-danger)
  const alertClass = type === "danger" ? "alert alert-danger" : "alert alert-success";

  return (
    <div className={alertClass}>
      <p>{message}</p>
    </div>
  );
}