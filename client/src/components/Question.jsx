import Answer from './Answer';

const Question = ({ q, onSetAnswer }) => {
  const { question, answers, key: qkey } = q;
  const groupName = qkey || 'question';

  return (
    <fieldset className="question-fieldset">
      <legend className="question-legend">{groupName.replace(/-/g, ' ')}</legend>
      <p className="question-text">{question}</p>
      <div className="answers">
        {answers.map((a, index) => (
          <Answer
            key={`${groupName}-${index}`}
            name={groupName}
            index={index}
            a={a}
            onSetAnswer={onSetAnswer}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default Question;

