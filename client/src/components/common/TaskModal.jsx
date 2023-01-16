import "../../css/custom-editor.css";
import React, { useEffect, useRef, useState } from "react";
import { Backdrop, Fade, IconButton, Modal, Box, TextField } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Moment from "moment";
import taskApi from "../../api/taskApi";

const modalStyle = {
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); //eslint-disable-line
  const editorWrapperRef = useRef();

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : "");
    setContent(props.task !== undefined ? props.task.content : "");
    if (props.task !== undefined) {
      isModalClosed = false;

      updateEditorHeight();
    }
  }, [props.task]);

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current;
        box.querySelector(".ck-editor__editable_inline").style.height =
          box.offsetHeight - 50 + "px";
      }
    }, timeout);
  };

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };

  const updateContent = async (event, editor) => { //eslint-disable-line
    clearTimeout(timer);
    const data = editor.getData();

    console.log({ isModalClosed });

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data });
        } catch (err) {
          alert(err);
        }
      }, timeout);

      task.content = data;
      setContent(data);
      props.onUpdate(task);
    }
  };

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <div
          style={modalStyle}
          className="bg-bg dark:bg-bg-dark w-4/5 h-3/6 md:w-3/6 pt-6 px-2 md:px-6"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <div className="text-sm text-text-accent dark:text-text-accent-dark">
              Delete task
            </div>
            <IconButton variant="outlined" color="error" onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <div className="p-1 md:p-3 ">
            <div className="text-text-accent dark:text-text-accent-dark text-sm">
              Edit task
            </div>
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-input": {
                  padding: 0,
                  textOverflow: "ellipsis",
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                "& .MuiOutlinedInput-root": {
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  fontFamily: "Plus Jakarta Sans",
                },
                marginBottom: "10px",
              }}
            />
            <p
              variant="body2"
              fontWeight="700"
              className="text-text-accent dark:text-text-accent-dark"
            >
              {task !== undefined
                ? Moment(task.createdAt).format("YYYY-MM-DD")
                : ""}
            </p>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
