import React from "react";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#333",
  className = "",
}) => {
  const spinnerStyle = React.useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      borderColor: color,
      borderTopColor: "transparent",
    }),
    [size, color]
  );

  return (
    <div className={styles.spinner_container}>
      <div
        className={`${styles.spinner} ${className}`}
        style={spinnerStyle}
        role="status"
        aria-label="Загрузка"
      />
    </div>
  );
};
