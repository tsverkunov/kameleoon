import styles from "./ControlPanel.module.scss";
import { Select } from "../CustomSelect/Select.tsx";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { Period, StyleMode } from "../../../types/types.ts";
import minusIcon from "../../assets/icons/minus.svg";
import plusIcon from "../../assets/icons/plus.svg";
import resetIcon from "../../assets/icons/reset.svg";
import fitIcon from "../../assets/icons/interactunselect.svg";

interface ControlPanelProps {
  setSelected: (ids: string[]) => void;
  variations: { id: string; name: string }[];
  styleMode: StyleMode;
  setStyleMode: Dispatch<SetStateAction<StyleMode>>;
  exportToPNG: () => void;
  onFit?: () => void;
  onZoomOut?: () => void;
  onZoomIn?: () => void;
  onReset?: () => void;
  period: Period;
  setPeriod: Dispatch<SetStateAction<"day" | "week">>;
  theme: "light" | "dark";
  setTheme: Dispatch<SetStateAction<"light" | "dark">>;
}

export const ControlPanel = ({
                               setSelected,
                               variations,
                               styleMode,
                               setStyleMode,
                               exportToPNG,
                               onFit,
                               onZoomOut,
                               onZoomIn,
                               onReset,
                               period,
                               setPeriod,
                               theme,
                               setTheme,
                             }: ControlPanelProps) => {

  const [ selectedVariation, setSelectedVariation ] = useState("all");

  const handleFit = onFit ?? (() => {});
  const handleZoomOut = onZoomOut ?? (() => {});
  const handleZoomIn = onZoomIn ?? (() => {});
  const handleReset = onReset ?? (() => {});

  // Список вариантов для Select
  const variationOptions = [
    { value: "all", label: "All variations selected" },
    ...variations.map(v => ({ value: v.id, label: v.name })),
  ];

  // Устанавливает выбранные линии
  const handleSelectVariation = (value: string) => {
    setSelectedVariation(value);

    if (value === "all") {
      setSelected(variations.map(v => v.id));
    } else {
      setSelected([ value ]);
    }
  };

  return (
    <nav>
      <div className={styles.controls}>
        <Select
          value={selectedVariation}
          onChange={handleSelectVariation}
          options={variationOptions}
        />

        <Select
          value={period}
          onChange={(v) => setPeriod(v as Period)}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
          ]}
        />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Select
            value={styleMode}
            onChange={(v) => setStyleMode(v as StyleMode)}
            options={[
              { value: "line", label: "Line" },
              { value: "smooth", label: "Smooth" },
              { value: "area", label: "Area" },
            ]}
          />

          <button className={styles.iconBtn} aria-label="Fit to screen" onClick={handleFit}>
            <img src={fitIcon} alt="fit to screen"/>
          </button>
          <div className={styles.segmented} aria-label="Zoom controls">
            <button className={styles.segment} onClick={handleZoomOut} aria-label="Zoom out">
              <img src={minusIcon} alt="zoom out"/>
            </button>
            <button className={styles.segment} onClick={handleZoomIn} aria-label="Zoom in">
              <img src={plusIcon} alt="zoom in"/>
            </button>
          </div>
          <button className={styles.iconBtn} aria-label="Reset" onClick={handleReset}>
            <img src={resetIcon} alt="reset"/>
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button className={styles.controlBtn} onClick={exportToPNG} aria-label="Export PNG">Export PNG</button>
        </div>

      </div>
    </nav>
  );
};
