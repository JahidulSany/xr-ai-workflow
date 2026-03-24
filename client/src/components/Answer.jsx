const Answer = ({ name, a, index, onSetAnswer }) => {
  const id = `${name}-${index}`;
  const src = a.image && a.image.startsWith('/') ? a.image : a.image;

  return (
    <div className="answer-row">
      <input
        type="radio"
        id={id}
        name={name}
        value={a.title}
        onChange={() => onSetAnswer(a.title)}
      />
      <label htmlFor={id} className="answer-label">
        <span className="answer-title">{a.title}</span>
        {a.description && <p className="answer-desc">{a.description}</p>}
        {src && (
          <img src={src} alt="" className="answer-thumb" />
        )}
      </label>
    </div>
  );
};

export default Answer;
