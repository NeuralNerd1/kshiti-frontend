export default function ProjectDashboard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 24,
      }}
    >
      <Stat title="Total Bugs" value="128" />
      <Stat title="Open Bugs" value="23" />
      <Stat title="Test Coverage" value="76%" />

      <div
        style={{
          gridColumn: "1 / -1",
          height: 260,
          borderRadius: 16,
          border: "1px solid #1F2937",
          background: "rgba(255,255,255,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9CA3AF",
        }}
      >
        Sample insights & graphs placeholder
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        border: "1px solid #1F2937",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 13, color: "#9CA3AF" }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}
