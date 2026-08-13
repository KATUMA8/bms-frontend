// src/components/Button.jsx
import { Link } from "react-router";

export default function Button({
  children,
  to,
  onClick,
  type = "button",
  variant = "secondary", // "primary", "danger", "cancel", "secondary" など
  className = "",
  ...props
}) {
  // variantに応じたクラス名を生成 (例: btn btn-primary, btn btn-danger など)
  const baseClass = `btn btn-${variant} ${className}`;

  // `to` が指定されている場合は React Router の Link として描画
  if (to) {
    return (
      <Link to={to} className={baseClass} {...props}>
        {children}
      </Link>
    );
  }

  // 通常の button 要素として描画
  return (
    <button type={type} onClick={onClick} className={baseClass} {...props}>
      {children}
    </button>
  );
}