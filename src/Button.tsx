import { MouseEventHandler } from "react";

function Button(prop: {
  roll: MouseEventHandler<HTMLButtonElement>;
  buttonText: string;
}) {
  return <button onClick={prop.roll}> {prop.buttonText}</button>;
}
export default Button;
