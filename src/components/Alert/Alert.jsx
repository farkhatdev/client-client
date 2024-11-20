import React from "react";
import "./alert.css";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../store/slices/uiSlice";
import { LuAlertTriangle } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";

const Alert = () => {
  const alert = useSelector((state) => state.ui.alert);
  const { active } = alert;
  const dispatch = useDispatch();
  if (active) {
    setTimeout(() => {
      dispatch(
        setAlert({
          message: "Error",
          active: false,
          type: "error",
        })
      );
    }, 1500);
  }
  return (
    <div
      className={`alert ${alert.active ? "active" : "no-active"} ${
        alert.type === "error" ? "error" : "success"
      }`}
    >
      <div className="alert-icon">
        <LuAlertTriangle style={{ transform: "translateY(-5%)" }} />
      </div>
      <p className="message">{alert.message}</p>
      <button
        className="delete-btn"
        onClick={() => {
          dispatch(
            setAlert((prev) => {
              return { ...prev, active: false };
            })
          );
        }}
      >
        <TiDelete size={22} />
      </button>
    </div>
  );
};

export default Alert;
