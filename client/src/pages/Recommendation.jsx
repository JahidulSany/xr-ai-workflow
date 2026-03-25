const Recommendation = ({content}) => {
  const {title, executiveSummary, costEstimate, references} = content || {};

  const { low, mid, high, assumptions } = costEstimate || {};

  const referencesList = references ? (
    <ul>
      {references.map((ref, index) => (
        <li key={index}><a href={ref.url} target="_blank" rel="noopener noreferrer">
          {ref.label}
        </a></li>
      ))}
    </ul>
  ) : null;

  return (
    <div>
      <div>Title: {title}</div>
      <div>Executive Summary: {executiveSummary}</div>
      <div>Cost Estimate:</div>
      <div>Low: {low}</div>
      <div>Medium: {mid}</div>
      <div>High: {high}</div>
      <div>Assumptions: {assumptions}</div>
      <div>References: </div>
      {referencesList}
    </div>
  )
}

export default Recommendation