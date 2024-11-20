import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { Link } from "react-router-dom";
import { DeleteApartment } from "../../api/deleteApartment";
import { setAlert } from "../../store/slices/uiSlice";
import { useDispatch } from "react-redux";

const Apartment = ({ apartment, action, setRefresh }) => {
  const dispatch = useDispatch();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const accessToken = localStorage.getItem("access-token");
  const decoded = jwtDecode(accessToken);
  const localPhone = String(decoded.phone);
  const aletRef = useRef();
  let {
    id,
    shortAddress,
    fullAddress,
    forWhom,
    price,
    rooms,
    images,
    phone1,
    duration,
    owner,
  } = apartment;

  if (shortAddress.length > 14)
    shortAddress = shortAddress.slice(0, 14) + "...";

   if (fullAddress.length > 20)
     fullAddress = fullAddress.slice(0, 20) + "...";

  const postedDate = new Date(id);
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = {
    year: postedDate.getFullYear(),
    day: postedDate.getDate(),
    month: months[postedDate.getMonth()],
  };
  const handleClickOutside = (e) => {
    if (aletRef.current && !aletRef.current.contains(e.target)) {
      setDeleteAlert(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { year, month, day } = date;

  return (
    <div className="apartment">
      {deleteAlert ? (
        <div className="delete-alert-background">
          <div className="delete-alert" ref={aletRef}>
            <h3>Are you sure you want to delete this item?</h3>
            <div className="apartment-main-detail-row buttons">
              <button
                className="delete cancel"
                onClick={() => setDeleteAlert(false)}
              >
                Cancel
              </button>
              <button
                className="delete"
                onClick={async () => {
                  try {
                    const response = await DeleteApartment(id);
                    setRefresh((prev) => !prev);
                    dispatch(
                      setAlert({
                        message: response?.data?.message,
                        type: "success",
                        active: true,
                      })
                    );
                  } catch (error) {
                    console.log(error, "hello");
                    dispatch(
                      setAlert({
                        message: error.response.message,
                        type: "error",
                        active: true,
                      })
                    );
                  } finally {
                    setDeleteAlert(false);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="apartment-head">
        <div className="apartment-img">
          <img src={images[0]} alt={fullAddress} />
        </div>
      </div>
      <div className="apartment-body">
        <div className="apartment-body-top">
          <h3>{shortAddress}</h3>
          <div className="posted-date">
            <CiCalendarDate
              size={18}
              style={{ transform: "translateY(-5%)" }}
            />
            <p>{`${day} ${month} ${year}`}</p>
          </div>
        </div>
        <div className="apartment-main-detail">
          <div className="apartment-main-detail-row">
            <span>Address: </span>
            <p>{fullAddress}</p>
          </div>
          <div className="apartment-main-detail-row">
            <span>Price: </span>
            <p className="price">
              {price} sum/{duration === "Kunlik" ? "kun" : "ayina"}
            </p>
          </div>
          <div className="apartment-main-detail-row">
            <span>For: </span>
            <p>{forWhom}</p>
          </div>
          <div className="apartment-main-detail-row">
            <span>Rooms: </span>
            <p>{rooms}</p>
          </div>
          <div className="apartment-main-detail-row">
            <span>Phone: </span>
            <p className="phone">{phone1}</p>
          </div>
          <div className="apartment-main-detail-row buttons">
            {localPhone === owner ? (
              <button className="delete" onClick={() => setDeleteAlert(true)}>
                Delete
              </button>
            ) : (
              <Link type="tel" className="call" href={`tel:+${phone1}`}>
                Call
              </Link>
            )}

            <Link to={`/apartments/${id}`}>View</Link>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
};

export default Apartment;
