import styles from "./Charts.module.css";

type Bar = { label: string; value: number };

export default function BarChart({
  title,
  data,
}: {
  title: string;
  data: Bar[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className={styles.chartCard}>
      <h3>{title}</h3>

      <div className={styles.bars}>
        {data.map((bar) => (
          <div key={bar.label} className={styles.barWrapper}>
            <div
              className={styles.bar}
              style={{
                height: `${(bar.value / max) * 100}%`,
              }}
            />
            <span>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
