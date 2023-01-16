import { useState, useEffect, useContext, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { KanbanContext } from "../../context/KanbanProvider";
import { SidebarContext } from "../../context/SidebarProvider";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import Sidebar from "../common/Sidebar";

const AppLayout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(KanbanContext);
  const { setToggleSidebar } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);

  const onResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setToggleSidebar(false);
    } else {
      setToggleSidebar(true);
    };
  }, []); //eslint-disable-line

  useEffect(() => {
    window.addEventListener("resize", onResize, { passive: true });
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener("resize", onResize, { passive: true });
    }
  }, [onResize]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate("/login");
      } else {
        // save user
        setUser(user);
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]); //eslint-disable-line

  return loading ? (
    <Loading fullHeight />
  ) : (
    <div className="main-container">
      <div className="flex">
        <Sidebar />
        <div className="right-side-container | w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
