import SearchIcon from "@material-ui/icons/Search";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";

export type IconName =
  | "search"
  | "homeOutlined"
  | "peopleAltOutlined"
  | "workOutlineOutlined"
  | "commentoutlined"
  | "notificationsOutlined";

type Icons = Record<IconName, any>;

const Icons: Icons = {
  search: SearchIcon,
  homeOutlined: HomeOutlinedIcon,
  peopleAltOutlined: PeopleAltOutlinedIcon,
  workOutlineOutlined: WorkOutlineOutlinedIcon,
  commentoutlined: CommentOutlinedIcon,
  notificationsOutlined: NotificationsOutlinedIcon,
};

export default Icons;
