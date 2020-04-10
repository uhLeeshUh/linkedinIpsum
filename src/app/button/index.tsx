import React from "react";
import styles from "./css/button.css";

interface IProps {
  buttonText: string;
  onClick: () => void | Promise<void>;
}

const Button = ({ buttonText, onClick }: IProps) => {
  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <button
      className={styles.button}
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {buttonText}
    </button>
  );
};

export default Button;
