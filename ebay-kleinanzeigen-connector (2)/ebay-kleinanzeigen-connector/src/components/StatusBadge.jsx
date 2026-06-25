const colorMap = {
  green:  'green',
  yellow: 'yellow',
  red:    'red',
  blue:   'blue',
  gray:   'gray',
};

export default function StatusBadge({ label, color = 'gray' }) {
  return (
    <span className={`badge ${colorMap[color] || 'gray'}`}>
      {label}
    </span>
  );
}
