import React, { useRef, useState } from "react";
import "./TextInput.css";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = focused || value.length > 0;

  return (
    <div className="textInputWrapper">
      <div
        className={`textInputContainer ${
          focused ? "focused" : ""
        } ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (!disabled) inputRef.current?.focus();
        }}
      >
        {/* LABEL */}
        <label className={`textInputLabel ${isActive ? "active" : ""}`}>
          {label}
        </label>

        {/* INPUT */}
        <input
          ref={inputRef}
          className="textInputField"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {/* ERROR */}
      {error && <div className="textInputError">{error}</div>}
    </div>
  );
};
