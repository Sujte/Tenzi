interface DieProps {
  value: number;
  hold: () => void;
  isHeld: boolean;
}

function Die({ value, hold, isHeld }: DieProps) {
  return (
    <div className={isHeld ? "die-clicked" : "die"} onClick={hold}>
      <div className={`dotgroup${value}`}>
        {Array(value)
          .fill(null)
          .map((value, index) => {
            return <div className={`dot dot-${index + 1}`}></div>;
          })}
      </div>
    </div>
  );
}
export default Die;
