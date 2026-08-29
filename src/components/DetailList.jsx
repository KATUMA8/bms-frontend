export default function DetailList({ items }) {
  return (
    <dl className="detail-list">
      {items.map((item, index) => (
        <div className="detail-item" key={index}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}