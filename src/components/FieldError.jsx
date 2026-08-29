export default function FieldError({ message }) {
  if (!message) return null;
  return <span className="error-text">{message}</span>;
}