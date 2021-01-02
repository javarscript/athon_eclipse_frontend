import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  createSvgIcon,
  FormControl,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";

import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import Stories  from "../parts/Stories/Stories";
import { connect } from "react-redux";
import { storiesActions } from "../store/action/stories.actions";
import { userActions } from "../store/action/user.actions";
import { PostFeed } from "./Form/PostFeed";
import { FeedCard } from "./Card/FeedCard";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  input: {
    display: "none",
  },
  storiesWrap:{
    display: "flex",
    // justifyContent: space-around,
    maxWidth: '35em',
    position: "relative",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  stories: {
    margin: "10px",
    width: "60px",
    height: "60px",
    // border:"5px solid"
  },
  storiesBorder: {
    border: "3px solid",
    borderColor: "#3F51B5",
  },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);
function Content(props) {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState({});
  const findMyStories = (props && props.stories && props.stories.user)?  props.stories.user.filter((value,i)=>{
    return value.username === props.authentication.user.username
  }):[]
  const handleClickOpen = (username) => {
    if(findMyStories.length>0 ||username !==props.authentication.user.username){
      setModalOpen({ ...modalOpen, [username]: true });
    }
  };

  const handleClose = (username) => {
    setModalOpen({ ...modalOpen, [username]: false });
  };

  const onChange = (e) => {
    const files = e.target.files[0];
    const formData = new FormData();
    formData.append("file", files);
    props.changeImage(formData);
    handleClose(props.authentication.user.username)
  };

  useEffect(() => {
    //after profile update, dont post to stories
    if(props.users.items){
      let body = {
        username : props.authentication.user.username,
        image : props.authentication.user.image,
        stories:{
          url:props.users.items.url
        }
      }
      props.postStories(body)
    }
  }, [props.users.items]);


  return (
    <div>
      <Card variant="outlined" className={" mb-4"}>
        <div className={classes.storiesWrap + " float-left"}>
          <div style={{ display: "inline-grid" }}>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={onChange}
            />
            <label
              htmlFor={findMyStories.length <= 0 ? "icon-button-file" : ""}
              style={{ display: "flex", marginBottom: 0 }}
            >
              <IconButton
                className="p-0"
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={() => handleClickOpen(props.user.username)}
              >
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={
                    findMyStories.length <= 0 ? (
                      <SmallAvatar alt="Add" src="add-icon.png" />
                    ) : (
                      ""
                    )
                  }
                >
                  <Avatar
                    src={props.user.image ? props.user.image : "person.jpg"}
                    className={[classes.stories, (findMyStories.length <= 0?" ":classes.storiesBorder)]}

                  />
                </Badge>
              </IconButton>
            </label>

            <Typography variant="caption" color="initial" className="mb-2">
              {props.user.username}
            </Typography>
          </div>
          {props &&
            props.stories &&
            props.stories.user &&
            props.stories.user.map((value, i) => {
              return (
                <div
                  style={{ display: "inline-grid" }}
                  key={i}
                  hidden={value.username === props.user.username}
                >
                  <IconButton
                    className="p-0"
                    onClick={() => handleClickOpen(value.username)}
                    key={i}
                  >
                    <Avatar
                      src={value.image ? value.image : "person.jpg"}
                      className={[classes.stories, classes.storiesBorder]}
                    />
                  </IconButton>
                  <Typography variant="caption" color="initial" className="mb-2">
                    {value.username}
                  </Typography>
                  <Stories
                    open={modalOpen[value.username]}
                    onClose={() => handleClose(value.username)}
                    userStories={value}
                  />
                </div>
              );
            })}
        </div>
      </Card>

      <PostFeed {...props}/>
      <FeedCard {...props}/>

      
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}
const mapDispatchToProps = {
  getAllStories: storiesActions.getAllStories,
  changeImage : userActions.changeImage,
  postStories : storiesActions.postStories
};

const connectedStories = connect(mapStateToProps, mapDispatchToProps)(Content);
export { connectedStories as Content };
