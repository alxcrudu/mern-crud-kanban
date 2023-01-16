import "./css/custom-scrollbar.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeProvider from "./context/ThemeProvider";
import KanbanProvider from "./context/KanbanProvider";
import SidebarProvider from "./context/SidebarProvider";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <KanbanProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="boards" element={<Home />} />
                <Route path="boards/:boardId" element={<Board />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </KanbanProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
