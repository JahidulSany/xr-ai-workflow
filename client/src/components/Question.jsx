import Answer from "./Answer";

const Question = ({q, onSetAnswer}) => {

    const {key, question, answers} = q;
    
  return (
    <div>
    <h3>{question}</h3>
    {answers.map((a, index) => (
        <Answer key={index} a={a} onSetAnswer={onSetAnswer}/>
        
    ))}
   
    </div>
  )
}

export default Question