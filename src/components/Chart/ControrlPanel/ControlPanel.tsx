import React from "react";
import styles from "./ControlPanel.module.scss";
import { useColorMap } from "../../../hooks/useColorMap.ts";

interface ControlPanelProps {
  selected: string[];
  variations: { id: string; name: string }[];
  toggle: (id: string) => void;
  exportToPNG: () => void;
  styleMode: "line" | "smooth" | "area";
  setStyleMode: (mode: "line" | "smooth" | "area") => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
                                                            selected,
                                                            variations,
                                                            toggle,
                                                            exportToPNG,
                                                            setStyleMode,
                                                          }) => {
  const colorMap  = useColorMap({ variations })

  return (
    <div>
      <div className={styles.controls}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className={styles.controlBtn} onClick={() => setStyleMode("line")}>
            Line
          </div>
          <div className={styles.controlBtn} onClick={() => setStyleMode("smooth")}>
            Smooth
          </div>
          <div className={styles.controlBtn} onClick={() => setStyleMode("area")}>
            Area
          </div>
        </div>

        <div className={styles.variants}>
          {variations.map((v) => (
            <label key={v.id} className={styles.legendItem}>
              <input
                type="checkbox"
                checked={selected.includes(v.id)}
                onChange={() => toggle(v.id)}
              />
              <span className={styles.legendDot} style={{ background: colorMap[v.id] }}/>
              <span>{v.name}</span>
            </label>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className={styles.controlBtn} onClick={exportToPNG}>Export PNG</button>
        </div>
      </div>
    </div>
  );
};
