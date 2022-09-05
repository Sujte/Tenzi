import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  roll: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

function Button({ children, roll }: ButtonProps) {
  return <button onClick={roll}> {children}</button>;
}
export default Button;
