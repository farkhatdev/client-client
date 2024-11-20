import React from "react";
import "./navbar.css";
import { LuMenu } from "react-icons/lu";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LogoImg from "../../utils/images/logo2.png";
import { useDispatch } from "react-redux";
import { setSidebar } from "../../store/slices/uiSlice";
import { setAuthenticated } from "../../store/slices/authSlice";

const Navbar = () => {
  const accessToken = localStorage.getItem("access-token");
  const decoded = jwtDecode(accessToken);
  const { phone, name } = decoded;
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-width">
          <div className="nav-left">
            <button
              className="sidebar-menu-icon"
              onClick={() => {
                dispatch(setSidebar(true));
              }}
            >
              <LuMenu size={28} color="blueviolet" />
            </button>
            <div className="logo-img">
              <Link to={"/apartments"}>
                <img src={LogoImg} alt="" />
              </Link>
            </div>
          </div>

          <ul className="navbar-menu">
            <li className="menu-item">
              <Link className="menu-item-link" to={"/apartments"}>
                Apartments
              </Link>
            </li>
            <li className="menu-item">
              <Link className="menu-item-link" to={"/create-post"}>
                New apartment
              </Link>
            </li>
            <li className="menu-item">
              <Link className="menu-item-link" to={"/profile"}>
                Profile
              </Link>
            </li>
          </ul>
          <div className="nav-right">
            <Link to={"/profile"}>
              <div className="profile">
                <div className="profile-img">
                  <h1>{name.at(0)}</h1>
                </div>
                <div className="profile-info">
                  <h4 className="profile-name">{name.split(" ")[0]}</h4>
                  <p>+{phone}</p>
                </div>
              </div>
            </Link>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("access-token");
                dispatch(setAuthenticated(false));
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
