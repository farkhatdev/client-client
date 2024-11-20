import React, { useCallback, useEffect, useState } from "react";
import "./profile.css";
import noDataImg from "../../utils/images/9264828.jpg";
import axios from "axios";
import Apartment from "../Apartments/Apartment";
import { jwtDecode } from "jwt-decode";

const NoData = ({ isArchived }) => {
  return (
    <div className="no-apartment">
      <img src={noDataImg} width={250} height={190} alt="" />
      <h3>
        You don't have any {isArchived ? "archived" : null} apartments :{"("}
      </h3>
    </div>
  );
};

let publicURL = "https://serverapp-xu995arr.b4a.run";
const Profile = () => {
  const accessToken = localStorage.getItem("access-token");
  const [archivedApartments, setArchivedApartments] = useState([]);
  const decoded = jwtDecode(accessToken);
  const [refresh, setRefresh] = useState(false);
  const { phone, name } = decoded;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const archiveApartment = async (id, action) => {
    try {
      setLoading(true);
      await axios.put(
        publicURL + `/apartment/archive/${id}`,
        { action: !action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchData = useCallback(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(publicURL + "/my-profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let archived = [];
        let unArchived = [];

        response?.data?.apartments.map((apartment) => {
          return apartment.isArchived
            ? archived.push(apartment)
            : unArchived.push(apartment);
        });

        setData(unArchived);
        setArchivedApartments(archived);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refresh, accessToken]);

  return (
    <div className="profile-page page">
      <div className="container">
        <div className="profile-inner">
          <div className="wrapper">
            <div className="profile-details">
              <div className="profile-page-img">
                <h1>{name.at(0)}</h1>
              </div>
              <div className="profile-page-info">
                <div className="profile-page-info-row">
                  <span>Name: </span>
                  <p>{name}</p>
                </div>
                <div className="profile-page-info-row">
                  <span>Phone: </span>
                  <p>+{phone}</p>
                </div>
              </div>
            </div>
            <div className="own-apartments">
              <div className="pagination">
                <button
                  className={isArchived ? null : "active"}
                  onClick={() => setIsArchived(false)}
                >
                  My apartments
                </button>
                <button
                  className={isArchived ? "active" : null}
                  onClick={() => setIsArchived(true)}
                >
                  Archived
                </button>
              </div>
              <div>
                {loading ? (
                  <div className="no-apartment">
                    <h3>Loading...</h3>
                  </div>
                ) : isArchived ? (
                  archivedApartments.length > 0 ? (
                    <div className="apartments">
                      {archivedApartments?.map((apartment, index) => (
                        <Apartment
                          setRefresh={setRefresh}
                          key={index}
                          apartment={apartment}
                          action={
                            <div className="apartment-main-detail-row buttons">
                              <button
                                className="delete archive"
                                onClick={() =>
                                  archiveApartment(
                                    apartment.id,
                                    apartment.isArchived
                                  )
                                }
                              >
                                Unarchive
                              </button>
                            </div>
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <NoData isArchived={isArchived} />
                  )
                ) : data.length > 0 ? (
                  <div className="apartments">
                    {data?.map((apartment, index) => (
                      <Apartment
                        setRefresh={setRefresh}
                        key={index}
                        apartment={apartment}
                        action={
                          <div className="apartment-main-detail-row buttons">
                            <button
                              className="delete archive"
                              onClick={() =>
                                archiveApartment(
                                  apartment.id,
                                  apartment.isArchived
                                )
                              }
                            >
                              Archive
                            </button>
                          </div>
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <NoData isArchived={isArchived} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
