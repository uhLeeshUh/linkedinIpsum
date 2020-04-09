import React from "react";
import Icons, { IconName } from "./icons";
import styles from "./css/icon.css";
import classnames from "classnames";

interface IProps {
  iconName: IconName;
  iconText?: string;
  isSmall?: boolean;
  isSearch?: boolean;
}

const Icon = ({ iconName, iconText, isSmall, isSearch }: IProps) => {
  const IconComponent = Icons[iconName];

  const iconStyles = classnames(
    (styles as any)[isSearch ? "searchColor" : "navColor"],
    {
      [styles.small]: isSmall,
    },
  );
  return (
    <div className={styles.iconContainer}>
      <IconComponent className={iconStyles} />
      {iconText ? <p className={styles.iconText}>{iconText}</p> : null}
    </div>
  );
};

export default Icon;
