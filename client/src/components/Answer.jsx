const Answer = ({ a, index, onSetAnswer }) => {
  return (
    <div key={index}>
      <input
        type="radio"
        id={a.title}
        name="answer"
        value={a.title}
        onChange={() => onSetAnswer(a.title)}
      />

      {a.title}
      {a.description && <p>{a.description}</p>}
      {a.image && (
        <img src={a.image} alt={a.title} style={{ width: '100px' }} />
      )}
    </div>
  );
};

export default Answer;
