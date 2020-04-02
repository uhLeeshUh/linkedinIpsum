import React from "react";
import Icon from "../icon";
import styles from "./css/header.css";

const Header = () => {
  return (
    <header className={styles.extendedNavContainer}>
      <div className={styles.navContainer}>
        <div>
          <Icon iconName="linkedIn" />
          <div>LinkedIn Ipsum</div>
        </div>
        <div>
          <Icon iconName="homeOutlined" iconText="Home" />
          <Icon iconName="peopleAltOutlined" iconText="My Network" />
          <Icon iconName="workOutlineOutlined" iconText="Jobs" />
          <Icon iconName="commentoutlined" iconText="Messaging" />
          <Icon iconName="notificationsOutlined" iconText="Notifications" />
        </div>
      </div>
    </header>
  );
};

export default Header;
