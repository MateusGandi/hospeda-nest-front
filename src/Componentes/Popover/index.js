import React, { useState } from "react";
import {
  IconButton,
  Popover,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OptionsPopover = ({ icon, options = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen}>
        {icon ? icon : <MoreVertIcon />}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List sx={{ minWidth: 180 }}>
          {options.map((option, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                option.action?.();
                handleClose();
              }}
            >
              <ListItemText primary={option.title} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default OptionsPopover;
