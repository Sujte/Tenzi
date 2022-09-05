import { nanoid } from "nanoid";
import { useReducer } from "react";

//test comment

const createNewGameValues = () => {
  const array: { value: number; isHeld: boolean; id: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const num = Math.ceil(Math.random() * 6);
    const obj = { value: num, isHeld: false, id: nanoid() };
    array.push(obj);
  }
  return array;
};

interface GameState {
  dieValues: ReturnType<typeof createNewGameValues>;
  hasWon: boolean;
  rollCount: number;
  bestTime: string;
  bestRollCount: number;
}

enum ActionType {
  SELECT_DIE = "SELECT_DIE",
  ROLL_DICE = "ROLL_DICE",
  RESTART = "RESTART",
}

type Action =
  | {
      type: ActionType.SELECT_DIE;
      payload: {
        id: string;
      };
    }
  | {
      type: ActionType.ROLL_DICE;
    }
  | {
      type: ActionType.RESTART;
    };

interface GameHistoryEntry {
  rollCount: number;
  time: {
    seconds: number;
    formattedSeconds: string;
  };
}

const gameHistory: GameHistoryEntry[] = JSON.parse(
  localStorage.getItem("scores")!
);

const bestHistoricRollcount = gameHistory.sort((a, b) => {
  return a.rollCount - b.rollCount;
})[0].rollCount;

const bestHistoricTime = gameHistory.sort((a, b) => {
  return a.time.seconds - b.time.seconds;
})[0].time.formattedSeconds;

const initialState: GameState = {
  dieValues: createNewGameValues(),
  hasWon: false,
  rollCount: 0,
  bestTime: bestHistoricTime,
  bestRollCount: bestHistoricRollcount,
};

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ActionType.SELECT_DIE: {
      const newDieState = state.dieValues.map((die) => {
        if (die.id === action.payload.id) {
          return {
            ...die,
            isHeld: true,
          };
        }
        return die;
      });
      const isAllSelected = newDieState.every((die) => die.isHeld);
      const isAllTheSameValue = newDieState.every((a) => a === newDieState[0]);
      const hasWon = isAllSelected && isAllTheSameValue;

      return {
        ...state,
        dieValues: newDieState,
        hasWon,
      };
    }
    case ActionType.ROLL_DICE: {
      const newDiceValues = state.dieValues.map((die) => {
        if (die.isHeld) {
          return die;
        }
        return {
          ...die,
          value: Math.ceil(Math.random() * 6),
        };
      });
      return {
        ...state,
        dieValues: newDiceValues,
        rollCount: state.rollCount + 1,
      };
    }
    case ActionType.RESTART: {
      return {
        ...state,
        dieValues: createNewGameValues(),
      };
    }
    default:
      return state;
  }
};

export const useTenziesReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const rollDice = () => dispatch({ type: ActionType.ROLL_DICE });
  const selectDie = (dieId: string) => {
    dispatch({ type: ActionType.SELECT_DIE, payload: { id: dieId } });
  };
  const restartGame = () => dispatch({ type: ActionType.RESTART });

  return {
    state,
    rollDice,
    selectDie,
    restartGame,
  };
};
