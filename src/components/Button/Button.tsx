import { ButtonProps } from "./Button.types";

const Button = (props: ButtonProps) => {
  return (
    <button
      className="button"
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text}
    </button>
  );
};

export default Button;
