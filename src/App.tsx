import Die from "./Die";
import Button from "./Button";
import Score from "./Score";
import { useEffect, useReducer } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import reducer, { ACTION_TYPES } from "./reducer";

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
  const [state, dispatch] = useReducer(reducer, {
    diceArray: values(),
    tenzies: false,
    rollCount: 0,
    gameDuration: Date.now(),
    stringGameDuration: "00:00",
    scoreArray: JSON.parse(localStorage.getItem("scores")!) || [],
  });

  useEffect(() => {
    const value = state.diceArray.map((x) => x.value);
    const ifTrue = state.diceArray.map((y) => y.isHeld);
    if (value.every((a) => a === value[0]) && ifTrue.every((a) => a === true)) {
      dispatch({ type: ACTION_TYPES.TENZIES, payload: { tenzies: true } });
      dispatch({
        type: ACTION_TYPES.STRING_GAME_DURATION,
        payload: { stringGameDuration: convertedTime() },
      });
      const ans = arrayMaker();
    } else {
      startTime();
    }
  }, [state.diceArray]);

  useEffect(() => {
    localStorage.setItem(" scores", JSON.stringify(state.scoreArray));
  }, [state.scoreArray]);

  const bestTime = () => {
    if (state.scoreArray.length === 0) {
      return "00:00";
    } else {
      const secondsArr = state.scoreArray.map(
        (x: { seconds: number }) => x.seconds
      );
      const bestestTime = Math.min(...secondsArr);
      const bestIndex = secondsArr.indexOf(bestestTime);
      const result = state.scoreArray[bestIndex].converted;
      return result;
    }
  };

  const bestRoll = () => {
    if (state.scoreArray.length === 0) {
      return 0;
    } else {
      const rollArray = state.scoreArray.map((x: { roll: number }) => x.roll);
      const result = Math.min(...rollArray);
      return result;
    }
  };

  const arrayMaker = () => {
    const scoreObj = {
      seconds: countedSeconds(),
      converted: convertedTime(),
      roll: state.rollCount,
      id: nanoid(),
    };
    dispatch({
      type: ACTION_TYPES.SCORE_ARRAY,
      payload: { scoreArray: [scoreObj, ...state.scoreArray] },
    });
  };

  const countedSeconds = () => {
    const seconds = Math.round((Date.now() - state.gameDuration) / 1000);
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

  const toggle = (key: string) => {
    const toggled = state.diceArray.map((x) => {
      if (x.id === key) {
        x.isHeld = !x.isHeld;
        return x;
      }
      return x;
    });
    dispatch({
      type: ACTION_TYPES.DICE_ARRAY,
      payload: { newDiceArray: toggled },
    });
    return key;
  };

  const startTime = () => {
    const count = state.diceArray.filter((x) => x.isHeld === true);
    if (count.length === 1) {
      dispatch({
        type: ACTION_TYPES.GAME_DURATION,
        payload: { gameDuration: Date.now() },
      });
    }
  };
  const makeTen = () => {
    return state.diceArray.map((x) => (
      <Die
        value={x.value}
        isHeld={x.isHeld}
        key={x.id}
        hold={() => toggle(x.id)}
      />
    ));
  };

  const name = () => {
    if (state.tenzies === false) {
      return "Tenzi";
    } else {
      return "You win!";
    }
  };

  const text = () => {
    if (state.tenzies === false) {
      return "Roll until all dice are the same. Click each die to freeze it at its current value between rolls.";
    } else {
      return "Your time:";
    }
  };

  const roll = () => {
    if (state.tenzies === false) {
      return "Roll";
    } else {
      return "New game";
    }
  };

  const restart = () => {
    if (state.tenzies === false) {
      dispatch({
        type: ACTION_TYPES.DICE_ARRAY,
        payload: { newDiceArray: freeze(state.diceArray) },
      });
      dispatch({
        type: ACTION_TYPES.ROLL_COUNT,
        payload: { rollCount: state.rollCount + 1 },
      });
    } else {
      dispatch({
        type: ACTION_TYPES.STRING_GAME_DURATION,
        payload: { stringGameDuration: "00:00" },
      });
      dispatch({
        type: ACTION_TYPES.DICE_ARRAY,
        payload: { newDiceArray: values() },
      });
      dispatch({ type: ACTION_TYPES.TENZIES, payload: { tenzies: false } });
      dispatch({ type: ACTION_TYPES.ROLL_COUNT, payload: { rollCount: 0 } });
    }
  };

  const freeze = (array: { value: number; isHeld: boolean; id: string }[]) => {
    const newArray = array.map((x) => {
      if (x.isHeld === false) {
        const num = Math.ceil(Math.random() * 6);
        return { value: num, isHeld: false, id: nanoid() };
      } else {
        return x;
      }
    });
    return newArray;
  };

  return (
    <>
      <div className="background">
        {state.tenzies && <Confetti />}
        <h1>{name()}</h1>
        <p className="text">{text()}</p>
        {state.tenzies && <p className="time">{state.stringGameDuration}</p>}
        <div className="group">{makeTen()}</div>
        <Button roll={() => restart()} buttonText={roll()} />
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
