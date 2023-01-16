import { useContext, useEffect, useState } from "react";
import { KanbanContext } from "../context/KanbanProvider";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { IconButton, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";

let timer;
const timeout = 500;

const Board = () => {
  const { favouriteList, setFavouriteList, boards, setBoards } =
    useContext(KanbanContext);
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIsFavourite(res.favourite);
        setIcon(res.icon);
      } catch (err) {
        alert(err);
      }
    };
    getBoard();
  }, [boardId]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        icon: newIcon,
      };
      setFavouriteList(tempFavourite);
    }

    setIcon(newIcon);
    setBoards(temp);
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        title: newTitle,
      };
      setFavouriteList(tempFavourite);
    }

    setBoards(temp);

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite });
      let newFavouriteList = [...favouriteList];
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter((e) => e.id !== boardId);
      } else {
        newFavouriteList.unshift(board);
      }
      setFavouriteList(newFavouriteList);
      setIsFavourite(!isFavourite);
    } catch (err) {
      alert(err);
    }
  };

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId);
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter((e) => e.id !== boardId);
        setFavouriteList(newFavouriteList);
      }

      const newList = boards.filter((e) => e.id !== boardId);
      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0].id}`);
      }
      setBoards(newList);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="board h-screen">
      <div className="top-bar | bg-bg dark:bg-bg-dark pt-4">
        <div className="top-bar-content | flex justify-between items-start">
          <div className="left-top-content | flex flex-col gap-2 pl-8 w-full">
            {/* emoji picker */}
            <EmojiPicker icon={icon} onChange={onIconChange} />
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder="Untitled"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-input": { padding: 0 },
                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                "& .MuiOutlinedInput-root": {
                  fontSize: "2rem",
                  fontWeight: "500",
                  fontFamily: "Plus Jakarta Sans",
                },
              }}
            />
            <TextField
              value={description}
              className="description | text-ellipsis"
              onChange={updateDescription}
              placeholder="Add a description"
              variant="outlined"
              multiline
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: 0,
                  whiteSpace: "nowrap",
                  overflow: "ellipsis",
                  textOverflow: "ellipsis",
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.8rem",
                  fontFamily: "Plus Jakarta Sans",
                },
              }}
            />
          </div>
          <div className="right-top-content | flex items-center w-min">
            <IconButton variant="outlined" onClick={addFavourite}>
              {isFavourite ? (
                <StarOutlinedIcon color="warning" />
              ) : (
                <StarBorderOutlinedIcon />
              )}
            </IconButton>
            <IconButton variant="outlined" color="error" onClick={deleteBoard}>
              <DeleteOutlinedIcon />
            </IconButton>
          </div>
        </div>
      </div>
      {/* Kanban board */}
      <Kanban data={sections} boardId={boardId} />
    </div>
  );
};

export default Board;
