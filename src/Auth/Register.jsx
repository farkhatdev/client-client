import React, { useEffect, useRef, useState } from "react";
import "./auth.css";
import emailSvg from "../utils/icons/email.svg";
import personSvg from "../utils/icons/person-svg.svg";
import passwordSvg from "../utils/icons/password.svg";
import verifySvg from "../utils/icons/verified-svgrepo-com.svg";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../store/slices/uiSlice";
import { setAuthenticated } from "../store/slices/authSlice";

const Register = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPasword: "",
    verifyCode: "",
  });
  const nameInputRef = useRef();

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, verifyCode: "" }));
  }, [step]);

  if (isAuthenticated) return <Navigate to={"/"} />;
  let publicURL = "https://serverapp-xu995arr.b4a.run";

  const handleChange = (e) => {
    let value = e.target.value;
    let lastLetter = String(value).at(value.length - 1);
    const regexEng = /^[A-Za-z]*$/;
    const regex = /^[0-9]*$/;
    if (e.target.name === "name") {
      if (!regexEng.test(lastLetter)) return;
      setForm({ ...form, name: value });
    } else if (e.target.name === "phone") {
      if (!regex.test(lastLetter)) return;
      let phoneNum = String(value);
      if (!phoneNum.startsWith("+998")) {
        setForm({ ...form, phone: "+998" });
      } else setForm({ ...form, phone: phoneNum });
    } else {
      setForm({
        ...form,
        [e.target.name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      try {
        const { name, phone, password, confirmPasword } = form;

        if (!name || !phone || !password || !confirmPasword) {
          return;
        }
        setLoading(true);
        const response = await axios.post(publicURL + "/auth/register", form);

        dispatch(
          setAlert({
            message: response?.data?.message,
            type: "success",
            active: true,
          })
        );
        setOtp(response?.data?.otp);
        setStep(2);
        setLoading(false);
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
    } else if (step === 2) {
      try {
        setLoading(true);
        let response = await axios.post(publicURL + "/auth/verify-code", form);
        localStorage.setItem("access-token", response?.data?.token);
        dispatch(setAuthenticated(true));
        dispatch(
          setAlert({
            message: response?.data?.message,
            type: "success",
            active: true,
          })
        );

        setLoading(false);
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
  };

  return (
    <div className="register auth-page container">
      {step === 1 ? (
        <form action="" onSubmit={handleSubmit} className="form">
          <div className="form-heading">
            <h2>Welcome, Create your account</h2>
          </div>
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="name">
                <img
                  className="form-icon"
                  src={personSvg}
                  width={18}
                  height={18}
                  alt=""
                />
              </label>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                name="name"
                placeholder="Name"
                value={form.name}
                type="text"
                ref={nameInputRef}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                <img
                  className="form-icon"
                  src={emailSvg}
                  width={20}
                  height={20}
                  alt=""
                />
              </label>
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                onChange={handleChange}
                maxLength={13}
                minLength={13}
                value={form.phone}
                autoComplete="off"
                onFocus={() => {
                  if (form.phone === "") {
                    setForm({
                      ...form,
                      phone: "+998",
                    });
                  }
                }}
                placeholder="+998 99 999 99 99"
                required
              />
            </div>
            <div className="form-columns">
              <div className="form-group">
                <label htmlFor="password">
                  <img
                    className="form-icon"
                    src={passwordSvg}
                    width={20}
                    height={20}
                    alt=""
                  />
                </label>
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  type="password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">
                  <img
                    className="form-icon"
                    src={passwordSvg}
                    width={20}
                    height={20}
                    alt=""
                  />
                </label>
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  id="confirm-password"
                  name="confirmPasword"
                  type={"password"}
                  onChange={handleChange}
                  value={form.confirmPasword}
                  required
                />
              </div>
            </div>

            <div className="form-group form-buttons">
              <button type="submit" className={loading ? "loading" : null}>
                {loading ? (
                  <BeatLoader size={12} color="#ffffff" />
                ) : (
                  "Register"
                )}
              </button>
              <Link to="/auth/login">Don't have an account?</Link>
            </div>
          </div>
        </form>
      ) : step === 2 ? (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>Verify your phone number</h2>
          </div>
          <p>
            Your OTP: <b>{otp}</b>
          </p>
          <div className="form-body">
            <p
              style={{
                marginBottom: "8px",
                textAlign: "center",
                color: "gray",
              }}
            >
              {form.phone}
            </p>
            <div className="form-group">
              <label htmlFor="email">
                <img
                  className="form-icon"
                  src={verifySvg}
                  width={20}
                  height={20}
                  alt=""
                />
              </label>
              <label htmlFor="name">OTP code:</label>
              <input
                className="otp-code"
                id="verifyCode"
                value={form.verifyCode}
                name="verifyCode"
                type="text"
                onChange={handleChange}
                required
                placeholder="000 000"
              />
            </div>
            <div className="form-group form-buttons">
              <button type="submit" className={loading ? "loading" : null}>
                {loading ? <BeatLoader size={12} color="#ffffff" /> : "Verify"}
              </button>
              <Link to="/auth/register" onClick={() => setStep(1)}>
                Edit phone number
              </Link>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default Register;
