function Die(prop: {
  value: number;
  hold: () => string;
  isHeld: boolean;
  key: string;
}) {
  const dots = (value: number) => {
    const dotNum = [];
    for (let i = value; i > 0; i--) {
      dotNum.push(<div className={`dot dot-${i}`}></div>);
    }
    const fullDotNum = [
      <div className={`dotgroup${value}`}> {[...dotNum]} </div>,
    ];
    return fullDotNum;
  };

  return (
    <div className={prop.isHeld ? "die-clicked" : "die"} onClick={prop.hold}>
      {dots(prop.value)}
    </div>
  );
}
export default Die;
