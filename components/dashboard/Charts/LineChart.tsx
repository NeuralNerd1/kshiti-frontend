import styles from "./Charts.module.css";

type Point = { label: string; value: number };

export default function LineChart({
  title,
  data,
}: {
  title: string;
  data: Point[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className={styles.chartCard}>
      <h3>{title}</h3>

      <svg viewBox="0 0 300 100" className={styles.svg}>
        {data.map((point, index) => {
          if (index === 0) return null;
          const prev = data[index - 1];

          const x1 = ((index - 1) / (data.length - 1)) * 300;
          const y1 = 100 - (prev.value / max) * 80;
          const x2 = (index / (data.length - 1)) * 300;
          const y2 = 100 - (point.value / max) * 80;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6366F1"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}
