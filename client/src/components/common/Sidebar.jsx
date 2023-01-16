import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { KanbanContext } from "../../context/KanbanProvider";
import { SidebarContext } from "../../context/SidebarProvider";
import { IconButton, ListItemButton } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import boardApi from "../../api/boardApi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FavouriteList from "./FavouriteList";
import { Switch } from "antd";
import { logoLight, logoDark, iconBoardPrimary, iconLight, iconDark, iconHideSidebar } from "../../assets";

const Sidebar = () => {
  const { user, boards, setBoards } = useContext(KanbanContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { sidebarIsOpen, toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0); // eslint-disable-line

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        setBoards(res);
        console.log(boards);
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, []); // eslint-disable-line

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    setBoards(newList);

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (err) {
      alert(err);
    }
  };

  const addBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res, ...boards];
      setBoards(newList);
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    sidebarIsOpen && (
      <div className="sidebar | h-screen bg-bg dark:bg-bg-dark flex flex-col justify-between p-6">
        <div>
          <div className="mb-6">
            {theme === "dark" ? (
              <img className="logo" src={logoLight} alt="logo" />
            ) : (
              <img className="logo" src={logoDark} alt="logo" />
            )}
          </div>
          <div>
            <div className="mb-6">
              <div className="w-full flex items-center justify-between text-accent dark:text-accent-dark">
                <p className="flex gap-2 items-center text-sm text-text-accent dark:text-text-accent-dark">
                  <span>
                    <AiOutlineUser
                      size={17}
                      className="text-text-accent dark:text-text-accent-dark"
                    />
                  </span>
                  {user.username}
                </p>
                <IconButton onClick={logout}>
                  <LogoutOutlinedIcon
                    fontSize="small"
                    className="text-text-accent dark:text-text-accent-dark"
                  />
                </IconButton>
              </div>
            </div>
            <FavouriteList />
            <div className="division-line | w-full h-px bg-primary-color opacity-10 my-5"></div>
            <div>
              <div className="w-full, flex, items-center font-light">
                <div className="flex uppercase text-sm mb-3 text-text-accent dark:text-text-accent-dark">
                  All boards{" "}
                  <div className="ml-2 text-text-accent dark:text-text-accent-dark">{`( ${boards.length} )`}</div>
                </div>
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                key={"list-board-droppable-key"}
                droppableId={"list-board-droppable"}
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {boards.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItemButton
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={index === activeIndex}
                            component={Link}
                            to={`/boards/${item.id}`}
                            sx={{
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                          >
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              className="font-light"
                            >
                              {item.icon} {item.title}
                            </p>
                          </ListItemButton>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button onClick={addBoard} className="flex items-center mt-6">
              <img
                src={iconBoardPrimary}
                alt="board icon"
                className="board-icon-primary"
              />
              <span className="ml-2 text-sm text-primary-color dark:text-primary-color">
                + Create new board
              </span>
            </button>
          </div>
        </div>
        <div>
          <div className="w-full flex justify-center align-center bg-theme-bg dark:bg-theme-bg-dark gap-8 py-3 rounded-lg">
            <div className="flex items-center">
              <img src={iconLight} alt="light theme icon" />
            </div>
            <div>
              <Switch defaultChecked onChange={toggleTheme} />
            </div>
            <div className="flex items-center">
              <img src={iconDark} alt="dark theme icon" />
            </div>
          </div>
          <div
            onClick={toggleSidebar}
            className="flex items-center gap-3 text-sm mt-6 ml-4 cursor-pointer"
          >
            <div>
              <img src={iconHideSidebar} alt="Hide sidebar icon" />
            </div>
            <span className="text-text-accent dark:text-text-accent-dark">
              Hide Sidebar
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;
