function Score(prop: {
  rollCount: number;
  bestTime: string;
  bestRoll: number;
}) {
  return (
    <div className="score-back">
      <div className="rollnum">
        <div className="roll-icon">
          <div className="icon-dot"></div>
          <div className="icon-dot"></div>
          <div className="icon-dot"></div>
        </div>
        <h2>{prop.rollCount}</h2>
      </div>
      <div className="best">
        <p className="best-text">Best time:</p>
        <p className="best-score">{prop.bestTime}</p>
        <p className="best-text">Best roll:</p>
        <p className="best-score">{prop.bestRoll}</p>
      </div>
    </div>
  );
}
export default Score;
