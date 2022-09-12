export enum ACTION_TYPES {
  DICE_ARRAY = "diceArray",
  TENZIES = "tenzies",
  ROLL_COUNT = "rollCount",
  GAME_DURATION = "gameDuration",
  STRING_GAME_DURATION = "stringGameDuration",
  SCORE_ARRAY = "scoreArray",
}

type Action =
  | {
      type: ACTION_TYPES.DICE_ARRAY;
      payload: { newDiceArray: Die[] };
    }
  | {
      type: ACTION_TYPES.TENZIES;
      payload: { tenzies: boolean };
    }
  | {
      type: ACTION_TYPES.ROLL_COUNT;
      payload: { rollCount: number };
    }
  | {
      type: ACTION_TYPES.GAME_DURATION;
      payload: { gameDuration: number };
    }
  | {
      type: ACTION_TYPES.STRING_GAME_DURATION;
      payload: { stringGameDuration: string };
    }
  | {
      type: ACTION_TYPES.SCORE_ARRAY;
      payload: { scoreArray: Score[] };
    };

interface Die {
  value: number;
  isHeld: boolean;
  id: string;
}

interface Score {
  seconds: number;
  converted: string;
  roll: number;
  id: string;
}

const reducer = (
  state: {
    diceArray: Die[];
    tenzies: boolean;
    rollCount: number;
    gameDuration: number;
    stringGameDuration: string;
    scoreArray: Score[];
  },
  action: Action
) => {
  switch (action.type) {
    case ACTION_TYPES.DICE_ARRAY:
      return { ...state, diceArray: action.payload.newDiceArray };
    case ACTION_TYPES.TENZIES:
      return { ...state, tenzies: action.payload.tenzies };
    case ACTION_TYPES.ROLL_COUNT:
      return { ...state, rollCount: action.payload.rollCount };
    case ACTION_TYPES.GAME_DURATION:
      return { ...state, gameDuration: action.payload.gameDuration };
    case ACTION_TYPES.STRING_GAME_DURATION:
      return {
        ...state,
        stringGameDuration: action.payload.stringGameDuration,
      };
    case ACTION_TYPES.SCORE_ARRAY:
      return { ...state, scoreArray: action.payload.scoreArray };
    default:
      return state;
  }
};
export default reducer;
