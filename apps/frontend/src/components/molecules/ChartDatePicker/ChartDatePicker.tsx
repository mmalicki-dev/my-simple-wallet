import styles from "./ChartDatePicker.module.css";

interface ChartDatePickerProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const ChartDatePicker = ({
  from,
  to,
  onFromChange,
  onToChange,
}: ChartDatePickerProps) => (
  <div className={styles.root}>
    <label className={styles.field}>
      <span className={styles.fieldLabel}>From</span>
      <input
        type="date"
        value={from}
        max={to}
        onChange={(e) => onFromChange(e.target.value)}
        className={styles.input}
      />
    </label>
    <label className={styles.field}>
      <span className={styles.fieldLabel}>To</span>
      <input
        type="date"
        value={to}
        min={from}
        max={todayIso()}
        onChange={(e) => onToChange(e.target.value)}
        className={styles.input}
      />
    </label>
  </div>
);

export default ChartDatePicker;
