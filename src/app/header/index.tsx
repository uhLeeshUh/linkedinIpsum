import React from "react";
import Icon from "../icon";
import styles from "./css/header.css";

const Header = () => {
  return (
    <header className={styles.extendedNavContainer}>
      <div className={styles.navContainer}>
        <div className={styles.navSection}>
          <p className={styles.linkedInLogo}>in</p>
          <div className={styles.searchBar}>
            <p className={styles.linkedInIpsumTitle}>Linkedin Ipsum</p>
          </div>
        </div>
        <div className={styles.navSection}>
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
