import React, { useEffect, useRef, useState } from "react";
import "./SelectField.css";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
};

export const SelectField: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  const isActive = focused || open || !!value;

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="selectWrapper">
      <div
        ref={ref}
        className={`selectContainer ${focused ? "focused" : ""}`}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
          setFocused(true);
        }}
      >
        {/* LABEL */}
        <label className={`selectLabel ${isActive ? "active" : ""}`}>
          {label}
        </label>

        {/* VALUE */}
        <div className="selectValue">{selectedLabel || ""}</div>

        {/* ARROW */}
        <div className="selectArrow">▾</div>

        {/* DROPDOWN */}
        {open && (
          <div
            className="selectDropdown"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`selectOption ${
                  opt.value === value ? "selected" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setFocused(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
