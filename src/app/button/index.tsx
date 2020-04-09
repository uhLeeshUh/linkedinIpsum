import React from "react";
import styles from "./css/button.css";

interface IProps {
  buttonText: string;
  onClick(): void;
}

const Button = ({ buttonText, onClick }: IProps) => {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {buttonText}
    </button>
  );
};

export default Button;
