import React, { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import styles from "./Select.module.scss";
import arrowIcon from "../../assets/icons/arrow-down.svg";
import type { StyleMode } from "../../../types/types.ts";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void | Dispatch<SetStateAction<StyleMode>>;
  options: Option[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
                                                value,
                                                onChange,
                                                options,
                                                placeholder = "Select",
                                              }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className={styles.select} ref={ref}>
      <button
        className={styles.control}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selectedLabel}</span>
        <img
          src={arrowIcon}
          className={`${styles.arrow} ${open ? styles.open : ""}`}
          alt="arrow"
        />
      </button>

      {open && (
        <div className={styles.menu}>
          {options.map((o) => (
            <div
              key={o.value}
              className={styles.option}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};