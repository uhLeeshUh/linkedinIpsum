import React from "react";
import Icon from "../icon/index";
import styles from "./css/header.css";
import classnames from "classnames";

const Header = () => {
  return (
    <header className={styles.extendedNavContainer}>
      <div className={styles.navContainer}>
        <div className={styles.navSection}>
          <p className={styles.linkedInLogo}>in</p>
          <div className={styles.searchBar}>
            <div className={styles.searchIcon}>
              <Icon iconName="search" isSmall isSearch />
            </div>
            <p className={styles.linkedInIpsumTitle}>Linkedin Ipsum</p>
          </div>
        </div>
        <div className={classnames(styles.navSection, styles.navRight)}>
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
