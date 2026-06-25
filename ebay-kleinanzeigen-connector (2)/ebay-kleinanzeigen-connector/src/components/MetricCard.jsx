export default function MetricCard({ label, value, sub, subColor }) {
  return (
    <div className="card metric">
      <label>{label}</label>
      <strong>{value}</strong>
      <span style={subColor ? { color: subColor } : {}}>{sub}</span>
    </div>
  );
}
