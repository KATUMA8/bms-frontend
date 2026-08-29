import FieldError from "./FieldError";

export default function FormInput({ label, name, value, onChange, error, required, type = "text", ...rest }) {
  return (
    <div className="form-group-block">
      <label>
        {label} {required && <span className="required">(必須)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "field-error" : ""}
        {...rest}
      />
      <FieldError message={error} />
    </div>
  );
}