import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as _ from 'lodash';
import * as moment from 'moment';
import { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { activityActions } from '../../store/action/activity.actions';
import { DialogAddEdit } from '../Dialog/DialogAddEdit';
import { DialogConfirmation } from '../Dialog/DialogConfirmation';

 function ActivityList(props) {
  const {check,status} = props
  const [anchorEl, setAnchorEl] = useState({});
  const classes = styles();
  const [data, setData] = useState({
    ids: {
      parentId: "",
      childId: "",
    },
    activity: {},
    modal: {},
    modalType: "",
  });
 


  const handleModal = (type, activity, parentId, childId) => {
    setData({
      ...data,
      ids: {
        ...data.parentId,
        parentId: parentId,
        ...data.childId,
        childId: childId,
      },
      ...data.activity,
      activity,
      ...data.modal,
      [type]: true,
      modalType: type,
    });

  };
  const handleCloseModal = (type) => {
    setData({ ...data.modal, [type]: false });
  };
    let listActivities
    if (check.item) {
      listActivities = _.filter(check.item.activities,(value,i)=>{
        return value.status === status
      }) 
    }
    const handleClickAnchor = (event, id) => {
      setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };
  
    const handleCloseAnchor = (id) => {
      setAnchorEl({ ...anchorEl, [id]: null });
    };
    const handleMoveStatus = (parentId,childId,activity,status,where) =>{
      let body = {
        parentId: parentId,
        childId: childId,
        activities: {
          activity: activity,
          status:'',
        },
      }
      if (where==='forward'){
        body.activities.status = status==='todo'?'doing':status==='doing'?'done':'done'
      } else if (where==='back') {
        body.activities.status = status==='done'?'doing':status==='doing'?'todo':'todo'
      }
      props.updateActivity(body)
    }
    return (

      <List className="pt-0 mt-0">
        {check.item &&
          listActivities.map((value, i) => {
            return (
              <div>
                <ListItem
                  button
                  onClick={() =>
                    handleModal(
                      "edit",
                      value.activity,
                      check.item._id,
                      value._id
                    )
                  }
                >
            <Tooltip title="Diarium" placement="left">

                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      className={classes.square + " mr-2"}
                    >
                      D
                    </Avatar>
                  </ListItemAvatar>
                  </Tooltip>
                  <ListItemText style={{ overflowWrap: "anywhere" }}>
                    <Typography variant="body" color="textPrimary" className={classes.elipsis}>
                      {value.activity}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" style={{width:'8em'}}>
                    {
                      value.createdDate
                        ? moment(value.createdDate).format("DD/MM/YYYY HH:mm")
                        : "-"
                    }
                    </Typography>
                  </ListItemText>

                  <ListItemSecondaryAction
                    style={{ display: "flex"}}
                  >
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleClickAnchor(e, value._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl[value._id]}
                      keepMounted
                      open={anchorEl[value._id]}
                      onClose={() => handleCloseAnchor(value._id)}
                    >
                      <MenuItem
                        key={value._id}
                        onClick={() => handleCloseAnchor(value._id)}
                      >
                        <IconButton
                        onClick={(e) =>
                          handleMoveStatus(check.item._id, value._id,value.activity,status,'forward')
                        }
                        style={{color:'#22AF25'}}
                        hidden={status==='done'}
                        >
                          <NavigateNextIcon />
                        </IconButton>
                      </MenuItem>
                      <MenuItem
                        key={value._id}
                        onClick={() => handleCloseAnchor(value._id)}
                      >
                        <IconButton
                        onClick={(e) =>
                          handleMoveStatus(check.item._id, value._id,value.activity,status,'back')
                        }
                        style={{color:'#22AF25'}}
                        hidden={status==='todo'}
                        >
                          <NavigateBeforeIcon />
                        </IconButton>
                      </MenuItem>
                      <MenuItem
                        key={value._id}
                        onClick={() => handleCloseAnchor(value._id)}
                      >
                        <IconButton
                          onClick={(e) =>
                            handleModal("delete", "", check.item._id, value._id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MenuItem>
                    </Menu>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            );
          })}
        <DialogAddEdit
          open={data[data.modalType]&& data.modalType!=='delete'}
          onClose={(e) => handleCloseModal(data.modalType)}
          type={data.modalType}
          activity={data.activity}
          user={props.authentication.payload._id}
          ids={data.ids}
          status={status}
        />
        <DialogConfirmation
          open={data[data.modalType]&& data.modalType=='delete'}
          onClose={(e) => handleCloseModal(data.modalType)}
          type={data.modalType}
          activity={data.activity}
          user={props.authentication.payload._id}
          ids={data.ids}
          status={status}
        />
      </List>
    );
  }
  const styles = makeStyles((theme) => ({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    tab: {
      minWidth: "auto",
      width: "auto",
    },
    square: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: '#D4232C',
      margin: "0 auto",
    },
    elipsis: {
      whiteSpace: "nowrap",
      width: "auto",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display:"block"
    },
  }));
  function mapStateToProps(state) {
    return state;
  }
  const mapDispatchToProps = {
  
    updateActivity : activityActions.updateActivity,
  };
  export default compose(
    connect(
      mapStateToProps,
      mapDispatchToProps 
    ),
    withStyles(styles)
  )(ActivityList);