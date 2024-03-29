import { Button, Card, CardActions, CardContent, CardHeader, Grow, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { PhotoCamera } from '@material-ui/icons';
import CreateIcon from '@material-ui/icons/Create';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { postsActions } from '../../store/action/post.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    marginRight: 0,
    marginLeft: 0,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
}));

function PostFeed(props) {
  const classes = useStyles();
  
  const [data, setData] = React.useState({
        content: "",
        image: "",
    
  });
  const handlePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", data.image);
    let body = {
        user : props.authentication.payload._id,
        image : props.user.image?props.user.image:'',
        posts : {
            content : data.content,
            image : data.image?formData:'',
            createdDate : Date()
        }
    }
    props.postFeed(body)
    setData({content:"",image:""})   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
        ...prevState,
          [name]: value,
    }));
  };

  const selectImage = (e) => {
    const files = e.target.files[0];

    setData((prevState)=>({
        ...prevState,
            image:files
    }))
  };
  return (
    <div>
      <Grow in={true}>
        <Card variant="outlined">
          <CardHeader id="form-Card-title">Add Activity</CardHeader>
          <CardContent>
            {/* <CardContentText>
            To subscribe to this website, please enter your activity address here. We will send updates
            occasionally.
          </CardContentText> */}

            <TextField
              autoFocus
              id="content"
              label="What Do You Think?"
              type="text"
              name="content"
              value={data.content}
              onChange={handleChange}
              multiline
              fullWidth
              rowsMax={7}
            />
          </CardContent>
          <CardActions className="mb-2 d-block">
            <div className="float-left mb-2">
              <input
                accept="image/*"
                className="d-none"
                id="icon-button-file-upload"
                type="file"
                onChange={selectImage}
              />
              <label htmlFor="icon-button-file-upload">
                <IconButton
                  color="primary"
                  aria-label="upload picture post"
                  component="span"
                  disabled={data.content === ""}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              <Typography variant="caption" color="initial">
                {data.image ? data.image.name : ""}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              className="float-right mb-2"
              onClick={handlePost}
              disabled={data.content === ""}
            >
              Post
            </Button>
          </CardActions>
        </Card>
      </Grow>
    </div>
  );
}
function mapStateToProps(state) {
  return state;
}

const mapDispatchToProps = {
  postFeed : postsActions.postFeed
};

const connectedPostFeed = connect(mapStateToProps, mapDispatchToProps)(PostFeed);
export { connectedPostFeed as PostFeed };
