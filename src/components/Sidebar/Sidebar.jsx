import React, { useEffect, useRef } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { BsClockHistory } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsCloudUpload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../store/slices/uiSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.ui.sidebar);
  const { isActive } = sidebar;
  const handleSidebar = () => dispatch(setSidebar(!isActive));
  const iconSize = 22;
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        dispatch(setSidebar(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div className={`sidebar ${isActive ? "active" : null}`} ref={sidebarRef}>
      <ul>
        <Link to={"/apartments"} onClick={handleSidebar}>
          <li>
            <div className="sidebar-icon">
              <AiOutlineHome size={iconSize} />
            </div>
            <p>Uzaq muddetli</p>
          </li>
        </Link>
        <Link to={"/apartments"} onClick={handleSidebar}>
          <li>
            <div className="sidebar-icon">
              <BsClockHistory size={iconSize - 2} />
            </div>
            <p>Kunlik kvartiralar</p>
          </li>
        </Link>
        <Link to={"/create-post"} onClick={handleSidebar}>
          <li>
            <div className="sidebar-icon">
              <BsCloudUpload size={iconSize} />
            </div>
            <p>Reklama beriw</p>
          </li>
        </Link>
        <Link to={"/profile"} onClick={handleSidebar}>
          <li>
            <div className="sidebar-icon">
              <CgProfile size={iconSize} />
            </div>
            <p>Profile</p>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
