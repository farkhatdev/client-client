import React, { useEffect, useState } from "react";
import Apartment from "./Apartment";
import "./apartments.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/slices/uiSlice";
import noDataImg from "../../utils/images/9264828.jpg";
import { HashLoader } from "react-spinners";

const NoData = () => {
  return (
    <div className="no-apartment apartments">
      <img src={noDataImg} width={400} height={330} alt="" />
      <h3>There is no apartment yet :{"("}</h3>
    </div>
  );
};

const Apartments = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    let publicURL = "https://serverapp-xu995arr.b4a.run";
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(publicURL + "/apartment", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        setLoading(false);
        setData(response?.data?.data);
      } catch (error) {
        setLoading(false);
        dispatch(
          setAlert({
            message: error?.response?.data?.message || "Error",
            type: "error",
            active: true,
          })
        );
      }
    }
    fetchData();
  }, [dispatch, refresh]);
  return (
    <div className="apartments page">
      <div className="container">
        <div className="apartments-inner">
          {data.length !== 0 ? (
            <div className="apartments-heading">
              <h2>Apartments in Nukus</h2>
            </div>
          ) : null}

          {loading ? (
            <div className="loading1">
              <HashLoader color="#8a2be2" size={100} />
            </div>
          ) : data.length > 0 ? (
            <div className="apartments-result">
              {data?.map((apartment, index) => {
                return (
                  <Apartment
                    key={index}
                    apartment={apartment}
                    setRefresh={setRefresh}
                  />
                );
              })}
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  );
};

export default Apartments;
