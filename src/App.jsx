import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import { useSelector } from "react-redux";
import Alert from "./components/Alert/Alert";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Apartments from "./pages/Apartments/Apartments";
import Sidebar from "./components/Sidebar/Sidebar";
import CreatePost from "./pages/CreatePost/CreatePost";
import Profile from "./pages/Profile/Profile";
import OneApartment from "./pages/Apartments/OneApartment";

function App() {
  const alert = useSelector((state) => state.ui.alert);
  const sidebar = useSelector((state) => state.ui.sidebar);

  return (
    <div className="app">
      {alert.active ? <Alert /> : null}
      {sidebar.isActive ? <Sidebar /> : null}

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/apartments/:id" element={<OneApartment />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
