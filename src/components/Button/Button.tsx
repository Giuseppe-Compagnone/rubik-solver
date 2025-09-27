import { ButtonProps } from "./Button.types";
import cn from "classnames";

const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn("button", props.disabled && "disabled")}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text}
    </button>
  );
};

export default Button;
