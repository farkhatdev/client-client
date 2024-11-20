import React, { useEffect, useRef, useState } from "react";
import "./createPost.css";
import { MdDelete } from "react-icons/md";
import personSvg from "../../utils/icons/person-svg.svg";
import clockSvg from "../../utils/icons/clock.svg";
import phoneSvg from "../../utils/icons/phone.svg";
import priceSvg from "../../utils/icons/price.svg";
import roomsSvg from "../../utils/icons/rooms.svg";
import addressSvg from "../../utils/icons/address.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/slices/uiSlice";
// import { YMaps, Map, Placemark } from "react-yandex-maps";
import { ClockLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

const CreatePost = () => {
  // States
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [place] = useState([42.442987, 59.617839]);
  const [activeOptionForWhom, setActiveOptionForWhom] = useState(false);
  const [activeOptionDuration, setOptionDuration] = useState(false);
  const [optionsDuration] = useState(["Uzaq muddetli", "Kunlik"]);
  const [step, setStep] = useState(1);
  const [optionsForWhom] = useState([
    "Student ballar",
    "Student qizlar",
    "Semeyniy",
  ]);

  const [form, setForm] = useState({
    shortAddress: "",
    fullAddress: "",
    forWhom: "",
    price: "",
    rooms: "",
    duration: "",
    phone1: "",
    phone2: "",
    condition: "",
    place,
    id: 145,
    owner: "124",
  });
  const accessToken = localStorage.getItem("access-token");
  let publicURL = "https://serverapp-xu995arr.b4a.run";
  // Refs
  const inputImgRef = useRef();
  const forWhomRef = useRef();
  const durationRef = useRef();
  const durationInputRef = useRef();
  const forWhomInputRef = useRef();

  // Handlers
  //  1
  const handleClickOutside = (event) => {
    if (
      forWhomRef.current &&
      !forWhomRef.current.contains(event.target) &&
      !forWhomInputRef.current.contains(event.target)
    ) {
      setActiveOptionForWhom(false);
    }
    if (
      durationRef.current &&
      !durationRef.current.contains(event.target) &&
      !durationInputRef.current.contains(event.target)
    ) {
      setOptionDuration(false);
    }
  };
  //  2
  const handleChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    const lastLetter = value.at(value.length - 1);
    const regex = /^[0-9]*$/;
    if (name === "forWhom" || name === "duration") return;
    if (name === "phone1" || name === "phone2") {
      if (!regex.test(lastLetter)) return;
      let phoneNum = String(e.target.value);
      if (!phoneNum.startsWith("+998")) {
        setForm((prev) => {
          return { ...prev, [name]: "+998" };
        });
      } else {
        setForm((prev) => {
          return { ...prev, [name]: value };
        });
      }
    } else {
      setForm((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  //  3
  const clearData = () => {
    setImages([]);
    setForm({
      shortAddress: "",
      fullAddress: "",
      forWhom: "",
      price: "",
      rooms: "",
      duration: "",
      phone1: "",
      phone2: "",
    });
  };

  //  4
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        if (images.length < 3)
          return dispatch(
            setAlert({
              message: "En kemi 3 foto saylan",
              type: "error",
              active: true,
            })
          );
        const isObjectValid = (obj) => {
          for (let key in obj) {
            if (
              obj[key] === null ||
              obj[key] === undefined ||
              obj[key] === ""
            ) {
              return false;
            }
          }
          return true;
        };
        if (!isObjectValid(form)) return;
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        setLoading(true);
        const formData = new FormData();
        images.map((image) => formData.append("images", image));
        formData.append("info", JSON.stringify(form));
        try {
          const response = await axios.post(
            publicURL + "/apartment",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          dispatch(
            setAlert({
              message: response?.data?.message,
              type: "success",
              active: true,
            })
          );
          clearData();
        } catch (error) {
          console.log(error);
          dispatch(
            setAlert({
              message: error?.response?.data?.message || "Error",
              type: "error",
              active: true,
            })
          );
        } finally {
          setStep(1);
          setLoading(false);
          <Navigate to={"/apartments"} />;
        }
      }
    } catch (error) {
      setStep(1);
    }
  };

  // Hooks

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="create-post page">
      <div className="container">
        <div className="create-post-inner">
          <div className="create-post-wrapper">
            <div className="steps">
              <div className={`step ${step >= 1 ? "active" : null}`}></div>
              <div className={`step ${step >= 2 ? "active" : null}`}></div>
              <div className={`step ${step >= 3 ? "active" : null}`}></div>
            </div>
            {step === 1 ? (
              <div className="posting-apartment-images">
                {images.map((image, index) => {
                  let url = URL.createObjectURL(image);
                  return (
                    <div key={index} className="posting-apartment-image">
                      <img src={url} alt="" width={200} height={200} />
                      <div className="delete-btn">
                        <button
                          onClick={() => {
                            const newImgs = images.filter(
                              (img) => img !== image
                            );
                            setImages(newImgs);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {images.length >= 6 ? null : (
                  <>
                    <div className="adding-apartment-btns">
                      <input
                        type="file"
                        accept="image/*"
                        ref={inputImgRef}
                        style={{ display: "none" }}
                        onChange={() => {
                          const file = inputImgRef.current.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setImages((prev) => {
                              return [...prev, file];
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <button
                        onClick={() => {
                          inputImgRef.current.click();
                        }}
                      >
                        Add image
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {step === 1 ? (
              <form className="apartment-post-form" onSubmit={handleSubmit}>
                <div className="apartment-form-body">
                  <div className="apartment-post-form-columns">
                    <div className="form-group">
                      <label htmlFor="shortAddress">
                        <img
                          className="form-icon"
                          src={addressSvg}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </label>
                      <label htmlFor="shortAddress">Qısqa address:</label>
                      <input
                        id="shortAddress"
                        name="shortAddress"
                        type="text"
                        autoComplete="off"
                        placeholder="27 mikro rayon"
                        maxLength={30}
                        minLength={5}
                        value={form.shortAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullAddress">
                        <img
                          className="form-icon"
                          src={addressSvg}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </label>
                      <label htmlFor="fullAddress">Tolıq address:</label>
                      <input
                        id="fullAddress"
                        name="fullAddress"
                        type="text"
                        value={form.fullAddress}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Aydın jol MPJ Mega nukus qasinda"
                        required
                      />
                    </div>
                  </div>
                  <div className="apartment-post-form-columns">
                    <div className="form-group">
                      <label htmlFor="forWhom">
                        <img
                          className="form-icon"
                          src={personSvg}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </label>
                      <label htmlFor="forWhom">Kimler ushın:</label>
                      <input
                        id="forWhom"
                        name="forWhom"
                        type="text"
                        ref={forWhomInputRef}
                        autoComplete="off"
                        placeholder="Student ballar"
                        value={form.forWhom}
                        onChange={handleChange}
                        required
                        onFocus={() => setActiveOptionForWhom(true)}
                      />
                      {activeOptionForWhom ? (
                        <ul className="option" ref={forWhomRef}>
                          {optionsForWhom.map((option, index) => {
                            return (
                              <li
                                key={index}
                                onClick={() => {
                                  setForm((prev) => {
                                    return { ...prev, forWhom: option };
                                  });
                                  setActiveOptionForWhom(false);
                                }}
                              >
                                {option}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="price">
                        <img
                          className="form-icon"
                          src={priceSvg}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </label>
                      <label htmlFor="price">Baxası: sumda</label>
                      <input
                        className="custom-number-input"
                        id="price"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="3 000 000 sum"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="duration">
                        <img
                          className="form-icon"
                          src={clockSvg}
                          width={22}
                          height={22}
                          alt=""
                        />
                      </label>
                      <label htmlFor="duration">Muddeti:</label>
                      <input
                        id="duration"
                        name="duration"
                        type="text"
                        value={form.duration}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Kunlik yaki ayliq"
                        onFocus={() => setOptionDuration(true)}
                        ref={durationInputRef}
                        required
                      />
                      {activeOptionDuration ? (
                        <ul className="option" ref={durationRef}>
                          {optionsDuration.map((option, index) => {
                            return (
                              <li
                                key={index}
                                onClick={() => {
                                  setForm((prev) => {
                                    return { ...prev, duration: option };
                                  });
                                  setOptionDuration(false);
                                }}
                              >
                                {option}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                  <div className="apartment-post-form-columns">
                    <div className="form-group">
                      <label htmlFor="rooms">
                        <img
                          className="form-icon"
                          src={roomsSvg}
                          width={21}
                          height={21}
                          alt=""
                        />
                      </label>
                      <label htmlFor="rooms">Xanalar sanı:</label>
                      <input
                        className="custom-number-input"
                        id="rooms"
                        name="rooms"
                        type="number"
                        value={form.rooms}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="3"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone1">
                        <img
                          className="form-icon"
                          src={phoneSvg}
                          width={20}
                          height={20}
                          alt=""
                        />
                      </label>
                      <label htmlFor="phone1">Baylanıs 1:</label>
                      <input
                        id="phone1"
                        name="phone1"
                        value={form.phone1}
                        onChange={handleChange}
                        type="tel"
                        maxLength={13}
                        minLength={13}
                        autoComplete="off"
                        placeholder="+998123456789"
                        onFocus={() => {
                          if (form.phone1 === "") {
                            setForm((prev) => {
                              return { ...prev, phone1: "+998" };
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone2">
                        <img
                          className="form-icon"
                          src={phoneSvg}
                          width={20}
                          height={20}
                          alt=""
                        />
                      </label>
                      <label htmlFor="phone2">Baylanıs 2:</label>
                      <input
                        id="phone2"
                        name="phone2"
                        type="tel"
                        value={form.phone2}
                        maxLength={13}
                        minLength={13}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="+998123456789"
                        onFocus={() => {
                          if (form.phone2 === "") {
                            setForm((prev) => {
                              return { ...prev, phone2: "+998" };
                            });
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="condition">
                      <img
                        className="form-icon"
                        src={roomsSvg}
                        width={18}
                        height={18}
                        alt=""
                      />
                    </label>
                    <label htmlFor="condition">Sharayatları</label>
                    <input
                      className="custom-number-input"
                      id="condition"
                      name="condition"
                      type="text"
                      value={form.condition}
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="Kir mashin, xoladelnik, Televizor"
                      required
                    />
                  </div>
                  <div className="form-btn-group form-buttons">
                    <button type="reset" onClick={clearData}>
                      Clear
                    </button>
                    <button type="submit">Next</button>
                  </div>
                </div>
              </form>
            ) : null}
            {step === 2 ? (
              <form className="apartment-post-form" onSubmit={handleSubmit}>
                <div className="apartment-form-body">
                  <div
                    className="map"
                    style={{ width: "100%", height: "400px" }}
                  >
                    {/* <YMaps
                      query={{ apikey: "d52c0095-ba4c-4140-8e30-f74f9f2703a3" }}
                    >
                      <Map
                        defaultState={{
                          center: place,
                          zoom: 16,
                          type: "yandex#map",
                        }}
                        modules={["control.TypeSelector"]}
                        width={"100%"}
                        height={"100%"}
                      >
                        <Placemark
                          geometry={place}
                          options={{
                            draggable: true,
                          }}
                          onDragEnd={(e) =>
                            setPlace(e.get("target").geometry.getCoordinates())
                          }
                        />
                      </Map>
                    </YMaps> */}
                    Yandex Maps
                  </div>
                  <div className="form-btn-group form-buttons">
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                    >
                      Back
                    </button>
                    <button type="submit">Next</button>
                  </div>
                </div>
              </form>
            ) : null}
            {step === 3 ? (
              <div className="view-ads-to-verify">
                <form className="apartment-post-form" onSubmit={handleSubmit}>
                  {loading ? (
                    <div className="uploading-loader">
                      <ClockLoader
                        color="#8a2be2"
                        size={100}
                        speedMultiplier={2}
                      />
                      <h2>Uploading...</h2>
                    </div>
                  ) : null}

                  <div className="apartment-form-body">
                    <div className="apartment-head">
                      <div className="apartment-img">
                        <img
                          src={URL.createObjectURL(images[0])}
                          alt={form.fullAddress}
                        />
                      </div>
                    </div>
                    <div className="apartment-body">
                      <div className="apartment-body-top">
                        <h3>{form.shortAddress}</h3>
                      </div>
                      <div className="apartment-main-detail">
                        <div className="apartment-main-detail-row">
                          <span>Address: </span>
                          <p>{form.fullAddress}</p>
                        </div>
                        <div className="apartment-main-detail-row">
                          <span>Price: </span>
                          <p className="price">
                            {form.price} sum/
                            {form.duration === "Kunlik" ? "kun" : "ayina"}
                          </p>
                        </div>
                        <div className="apartment-main-detail-row">
                          <span>For: </span>
                          <p>{form.forWhom}</p>
                        </div>
                        <div className="apartment-main-detail-row">
                          <span>Rooms: </span>
                          <p>{form.rooms}</p>
                        </div>
                        <div className="apartment-main-detail-row">
                          <span>Phone: </span>
                          <p className="phone">{form.phone1}</p>
                        </div>
                      </div>
                    </div>
                    <div className="form-btn-group form-buttons">
                      <button
                        type="button"
                        onClick={() => setStep((prev) => prev - 1)}
                      >
                        Back
                      </button>
                      <button type="submit">Upload</button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
