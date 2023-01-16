import { useState, useContext } from "react";
import { KanbanContext } from "../context/KanbanProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";

const Home = () => {
  const { setBoards } = useContext(KanbanContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createBoard = async () => {
    setLoading(true);
    try {
      const res = await boardApi.create();
      setBoards([res]);
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <LoadingButton
        variant="outlined"
        color="success"
        onClick={createBoard}
        loading={loading}
      >
        Click here to create your first board
      </LoadingButton>
    </div>
  );
};

export default Home;
