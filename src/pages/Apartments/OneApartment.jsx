import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./oneApartment.css";
import { HashLoader } from "react-spinners";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

const OneApartment = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const getOneApartment = useCallback(() => {
    let publicURL = "https://serverapp-xu995arr.b4a.run";
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(publicURL + "/apartment/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        setLoading(false);
        setData(response?.data?.data);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    getOneApartment();
  }, []);
  return (
    <div>
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoMdArrowBack size={25} />
        </button>
        <div className="one-apartment-inner">
          {loading ? (
            <div className="loading1">
              <HashLoader color="#8a2be2" size={100} />
            </div>
          ) : (
            data && (
              <div className="one-apartment-wrapper">
                <div className="wrapper-top">
                  <h1>{data.shortAddress}</h1>
                </div>
                <div className="one-apartment-images">
                  {data?.images?.map((image, i) => {
                    return (
                      <div key={i} className="one-apartment-image">
                        <img src={image} alt={image} width={250} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OneApartment;
