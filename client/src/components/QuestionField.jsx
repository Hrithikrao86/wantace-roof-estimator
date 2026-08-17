export default function QuestionField({ question, value, error, onChange }) {
  if (question.type === 'number') {
    return (
      <div className="field">
        <label htmlFor={question.key}>{question.label}{question.unit ? ` (${question.unit})` : ''}</label>
        <input
          id={question.key}
          type="number"
          min={question.min}
          max={question.max}
          value={value ?? ''}
          onChange={(event) => onChange(question.key, event.target.value === '' ? '' : Number(event.target.value))}
          aria-invalid={Boolean(error)}
        />
        <small>Enter a value between {question.min} and {question.max}.</small>
        {error && <p className="field-error">{error}</p>}
      </div>
    );
  }

  return (
    <fieldset className="field">
      <legend>{question.label}</legend>
      <div className="option-list">
        {question.options.map((option) => (
          <label className={`option ${value === option.value ? 'selected' : ''}`} key={option.value}>
            <span>{option.label}</span>
            <input
              type="radio"
              name={question.key}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(question.key, option.value)}
            />
          </label>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </fieldset>
  );
}
