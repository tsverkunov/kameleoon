import type { PreparedPoint } from "../../../utils/prepareChartData.ts";
import styles from "./Tooltip.module.scss";
import React from "react"
import calendarIcon from "../../assets/icons/calendar.svg";
import { dateFormatter } from "../../../utils/dateFormatter.ts";
import generalIcon from "../../assets/icons/generalbest.svg";

interface TooltipProps {
  tooltipData: { point: PreparedPoint };
  tooltipLeft?: number;
  selected: string[];
  colorMap: Record<string, string>;
  variations: { id: string; name: string }[];
}

export const Tooltip = ({
                          tooltipData,
                          tooltipLeft,
                          selected,
                          colorMap,
                          variations,
                        }: TooltipProps) => {

  const sortedSelected = [ ...selected ].sort((a, b) => {
    const valA = (tooltipData.point as PreparedPoint)[a] as number | null | undefined;
    const valB = (tooltipData.point as PreparedPoint)[b] as number | null | undefined;

    const numA = typeof valA === "number" ? valA : -Infinity;
    const numB = typeof valB === "number" ? valB : -Infinity;

    return numB - numA;
  });


  return (
    <div className={styles.wrapper}>
      <div
        className={styles.popover}
        style={{
          ["--tooltip-left"]: `${tooltipLeft ?? 0}px`,
        } as React.CSSProperties}
      >
        <div className={styles.tooltip}>
          <div className={styles.header}>
            <img src={calendarIcon} alt="calendar icon"/>
            {dateFormatter(tooltipData.point.date)}
          </div>
          <div className={styles.line}></div>
          {sortedSelected.map((id, index) => {
            const val = (tooltipData.point as PreparedPoint)[id] as number | null | undefined;
            return (
              <div key={id} className={styles.row}>
                <div className={styles.rowLeft}>
                  <span
                    className={styles.dot}
                    style={{ ["--dot-color"]: colorMap[id] } as React.CSSProperties}
                  />
                  <div className={styles.name}>
                    {variations.find((v) => v.id === id)?.name ?? id}
                  </div>
                  {index === 0 && <img src={generalIcon} alt="general icon"/>}
                </div>
                <div className={styles.value}>
                  {typeof val === "number" ? `${val.toFixed(2)}%` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
