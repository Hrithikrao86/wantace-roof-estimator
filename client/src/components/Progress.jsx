export default function Progress({ current, total }) {
  return (
    <div className="progress-wrap" aria-label={`Step ${current} of ${total}`}>
      <div className="progress-track">
        <div className="progress-value" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span>Step {current} of {total}</span>
    </div>
  );
}
