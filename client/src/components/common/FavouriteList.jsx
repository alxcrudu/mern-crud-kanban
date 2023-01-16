import { useEffect, useState, useContext } from "react";
import { KanbanContext } from "../../context/KanbanProvider";
import { ListItemButton } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import boardApi from "../../api/boardApi";

const FavouriteList = () => {
  const { favouriteList, setFavouriteList } = useContext(KanbanContext);
  const [activeIndex, setActiveIndex] = useState(0); // eslint-disable-line
  const { boardId } = useParams();
  const list = favouriteList;

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites();
        setFavouriteList(res);
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, []); // eslint-disable-line

  useEffect(() => {
    const index = list.findIndex((e) => e.id === boardId);
    setActiveIndex(index);
  }, [list, boardId]);

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...list];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);

    setFavouriteList(newList);

    try {
      await boardApi.updateFavouritePosition({ boards: newList });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-start mb-3">
        <h2 className="uppercase text-text-accent dark:text-text-accent-dark text-sm">
          Favourites
        </h2>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          key={"list-board-droppable-key"}
          droppableId={"list-board-droppable"}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <ListItemButton
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      // selected={index === activeIndex}
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
    </>
  );
};

export default FavouriteList;
