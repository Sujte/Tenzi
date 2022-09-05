import Die from "./Die";
import Button from "./Button";
import Score from "./Score";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useTenziesReducer } from "./hooks/useTenziesReducer";

const values = () => {
  const array: { value: number; isHeld: boolean; id: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const num = Math.ceil(Math.random() * 6);
    const obj = { value: num, isHeld: false, id: nanoid() };
    array.push(obj);
  }
  return array;
};

function App() {
  const { state, restartGame, rollDice, selectDie } = useTenziesReducer();
  const [newArr, setNewArr] = useState(values());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [time, setTime] = useState(Date.now());
  const [duration, setDuration] = useState("00:00");
  const [scoreArray, setScoreArray] = useState(
    JSON.parse(localStorage.getItem("scores")!) || []
  );

  useEffect(() => {
    const value = newArr.map((x) => x.value);
    const ifTrue = newArr.map((y) => y.isHeld);
    if (value.every((a) => a === value[0]) && ifTrue.every((a) => a === true)) {
      setTenzies(true);
      setDuration(convertedTime);
      const ans = arrayMaker();
    } else {
      startTime();
    }
  }, [newArr]);

  useEffect(() => {
    localStorage.setItem(" scores", JSON.stringify(scoreArray));
  }, [scoreArray]);

  const bestTime = () => {
    if (scoreArray.length === 0) {
      return "00:00";
    } else {
      const secondsArr = scoreArray.map((x: { seconds: number }) => x.seconds);
      const bestestTime = Math.min(...secondsArr);
      const bestIndex = secondsArr.indexOf(bestestTime);
      const result = scoreArray[bestIndex].converted;
      return result;
    }
  };

  const bestRoll = () => {
    if (scoreArray.length === 0) {
      return 0;
    } else {
      const rollArray = scoreArray.map((x: { roll: number }) => x.roll);
      const result = Math.min(...rollArray);
      return result;
    }
  };

  const arrayMaker = () => {
    const scoreObj = {
      seconds: countedSeconds(),
      converted: convertedTime(),
      roll: rollCount,
      id: nanoid(),
    };
    setScoreArray((prev: object[]) => [scoreObj, ...prev]);
  };

  const countedSeconds = () => {
    const seconds = Math.round((Date.now() - time) / 1000);
    return seconds;
  };

  const timeConverter = () => {
    const secondsToConvert = countedSeconds();
    if (secondsToConvert < 10) {
      return "00:0" + secondsToConvert;
    } else if (secondsToConvert < 60) {
      return "00:" + secondsToConvert;
    } else if (secondsToConvert < 600 && secondsToConvert % 60 < 10) {
      return (
        "0" + Math.floor(secondsToConvert / 60) + ":0" + (secondsToConvert % 60)
      );
    } else if (secondsToConvert < 600 && secondsToConvert % 60 >= 10) {
      return (
        "0" + Math.floor(secondsToConvert / 60) + ":" + (secondsToConvert % 60)
      );
    } else if (secondsToConvert >= 600 && secondsToConvert % 60 < 10) {
      return Math.floor(secondsToConvert / 60) + ":0" + (secondsToConvert % 60);
    } else if (secondsToConvert >= 600 && secondsToConvert % 60 >= 10) {
      return Math.floor(secondsToConvert / 60) + ":" + (secondsToConvert % 60);
    } else if (secondsToConvert >= 3600) {
      return "Too slow...";
    } else {
      return "Too slow...";
    }
  };

  const convertedTime = () => {
    return timeConverter();
  };

  const startTime = () => {
    const count = newArr.filter((x) => x.isHeld === true);
    if (count.length === 1) {
      setTime(Date.now());
    }
  };

  const heading = tenzies ? "You win!" : "Tenzi";
  const rollText = tenzies
    ? "Your time:"
    : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls.";

  const rollButtonText = tenzies ? "New game" : "New game";

  return (
    <>
      <div className="background">
        {state.hasWon && <Confetti />}
        <h1>{heading}</h1>
        <p className="text">{rollText}</p>
        {state.hasWon && <p className="time">{duration}</p>}
        <div className="group">
          {state.dieValues.map((x) => (
            <Die
              value={x.value}
              isHeld={x.isHeld}
              key={x.id}
              hold={() => selectDie(x.id)}
            />
          ))}
        </div>
        <Button roll={state.hasWon ? restartGame : rollDice}>
          {rollButtonText}
        </Button>
      </div>
      <Score
        rollCount={state.rollCount}
        bestTime={bestTime()}
        bestRoll={bestRoll()}
      />
    </>
  );
}
export default App;
