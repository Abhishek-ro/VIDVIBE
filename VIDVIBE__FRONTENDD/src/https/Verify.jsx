import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { verifyEmail } from "../API/index.js";
import "./Verify.css"; 

const VerificationPage = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      enqueueSnackbar("No email found for verification.", { variant: "error" });
      navigate("/register");
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleVerify = async () => {
    if (!email) {
      enqueueSnackbar("Email information is missing.", { variant: "error" });
      return;
    }

    try {
      const response = await verifyEmail({ email, code: verificationCode });
      enqueueSnackbar(response.data.message || "Email verified successfully!", {
        variant: "success",
      });
      const { accessToken } = response.data.data;
      localStorage.removeItem("verificationEmail");
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      setVerificationStatus(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      enqueueSnackbar("Email information is missing.", { variant: "error" });
      return;
    }
    try {
      enqueueSnackbar("Verification code resent to your email.", {
        variant: "info",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend verification code.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div className="verification-container">
      <h1 className="verification-title">Verify Your Email</h1>
      <p className="verification-instruction">
        Please enter the verification code sent to your email address:{" "}
        <strong className="highlight-email">{email}</strong>
      </p>
      <input
        type="text"
        className="verification-input"
        value={verificationCode}
        onChange={handleInputChange}
        placeholder="Enter verification code"
      />
      <button className="verify-btn" onClick={handleVerify}>
        Verify
      </button>
      {verificationStatus && (
        <p className="verification-error">{verificationStatus}</p>
      )}
      <p className="resend-section">
        Didn't receive the code?
        <button className="resend-btn" onClick={handleResendCode}>
          Resend code
        </button>
      </p>
    </div>
  );
};

export default VerificationPage;
