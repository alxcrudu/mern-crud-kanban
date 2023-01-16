import { useEffect, useState, useContext } from "react";
import { SidebarContext } from "../../context/SidebarProvider";
import { TextField, IconButton, Card } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";
import { iconHideSidebar } from "../../assets";

let timer;
const timeout = 500;

const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const { sidebarIsOpen, toggleSidebar } = useContext(SidebarContext);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      setData([...data, section]);
    } catch (err) {
      alert(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    if (e === "") return;
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId });
      const newData = [...data];
      const index = newData.findIndex((e) => e.id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  let count = 0;
  const colors = ["bg-todo", "bg-doing", "bg-done"];

  function randomColor() {
    let color = colors[count];
    count++;
    if (count === colors.length) {
      count = 0;
    }
    return color;
  }

  return (
    <div
      className="kanban | relative overflow-hidden"
      style={{ width: sidebarIsOpen ? "calc(100vw - 300px)" : "100vw" }}
    >
      <div className="kanban-content | flex pt-4 pl-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6">
            {data.map((section) => (
              <div key={section.id} style={{ width: "300px" }}>
                <div className="flex items-center mb-4">
                  <div
                    className={`circle rounded-full w-3 h-3 ${randomColor()} mr-2`}
                  ></div>
                  <TextField
                    value={section.title}
                    onChange={(e) => updateSectionTitle(e, section.id)}
                    placeholder="Untitled"
                    variant="outlined"
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-input": { padding: 0 },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "unset ",
                      },
                      "& .MuiOutlinedInput-root": {
                        fontSize: "1rem",
                        fontWeight: "500",
                        fontFamily: "Plus Jakarta Sans",
                      },
                    }}
                    InputLabelProps={{ className: "ui__textfield" }}
                  />
                  <div className="text-text-accent dark:text-text-accent-dark font-light text-sm mr-2">{`(${section.tasks.length})`}</div>
                  <IconButton
                    variant="outlined"
                    size="small"
                    className="text-text-accent dark:text-text-accent-dark"
                    onClick={() => createTask(section.id)}
                  >
                    <AddOutlinedIcon />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    size="small"
                    className="text-text-accent dark:text-text-accent-dark"
                    onClick={() => deleteSection(section.id)}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </div>
                <Droppable key={section.id} droppableId={section.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="tasks-container | pb-14"
                    >
                      {/* tasks */}
                      {section.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task-card py-4 px-4 rounded-md flex items-center justify-between"
                              elevation={0}
                              sx={{
                                marginBottom: "10px",
                                boxShadow: "none",
                                cursor: snapshot.isDragging
                                  ? "grab"
                                  : "pointer!important",
                              }}
                              onClick={() => setSelectedTask(task)}
                            >
                              <p
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                className="text-sm font-light text"
                              >
                                {task.title === "" ? "Untitled" : task.title}
                              </p>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
        <div
          onClick={createSection}
          className="new-column | flex items-center justify-center font-light h-full ml-6 mr-12 cursor-pointer rounded-md bg-bg-new-task dark:bg-bg-new-task-dark"
        >
          <span className="text-primary-color dark:text-primary-color">
            New Column
          </span>
        </div>
      </div>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        TaskModalProps={{ className: "ui_modal" }}
      />
      {!sidebarIsOpen && (
        <div className="absolute bottom-6 left-0">
          <div
            onClick={toggleSidebar}
            className="flex items-center gap-3 text-sm mt-6 ml-4 cursor-pointer"
          >
            <div>
              <img src={iconHideSidebar} alt="Hide sidebar icon" />
            </div>
            <span className="text-text-accent dark:text-text-accent-dark">
              Show Sidebar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
