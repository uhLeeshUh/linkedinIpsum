import React from "react";
import Icon from "./icon";

const Header = () => {
  return (
    <div>
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
  );
};

export default Header;
