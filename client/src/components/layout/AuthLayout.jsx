import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import { logoLight, logoDark } from "../../assets";

const AuthLayout = () => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
      } else {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <main className="main-container">
      <div className="mt-16 flex items-center flex-col">
        <img
          src={theme === "dark" ? logoLight : logoDark}
          alt="Logo"
          className="mb-6"
        />
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
