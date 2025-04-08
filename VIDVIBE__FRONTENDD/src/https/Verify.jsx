import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { verifyEmail } from "../API/index.js"; // Your API function

const VerificationPage = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [email, setEmail] = useState(""); // To pass to the verification API

  useEffect(() => {
    // Retrieve the email (or another identifier) from local storage
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Handle case where email is not found (e.g., user navigated directly)
      enqueueSnackbar("No email found for verification.", { variant: "error" });
      navigate("/register"); // Redirect back to register
    }
  }, [navigate, enqueueSnackbar]);

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
      console.log("HEHEHHEHEHEHEH",response)
      enqueueSnackbar(response.data.message || "Email verified successfully!", {
        variant: "success",
      });
      const { accessToken } = response.data.data;
      localStorage.removeItem("verificationEmail"); 
      localStorage.setItem("accessToken", accessToken);
      navigate("/"); 
    } catch (error) {
      console.error("Verification failed:", error);
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
      // Implement your API call to resend the verification code
      // const response = await resendVerificationCode({ email });
      enqueueSnackbar("Verification code resent to your email.", {
        variant: "info",
      });
    } catch (error) {
      console.error("Failed to resend code:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to resend verification code.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div className="b">
      <h1>Verify Your Email</h1>
      <p>
        Please enter the verification code sent to your email address:{" "}
        <strong>{email}</strong>
      </p>
      <input
        type="text"
        value={verificationCode}
        onChange={handleInputChange}
        placeholder="Enter verification code"
      />
      <button onClick={handleVerify}>Verify</button>
      {verificationStatus && (
        <p style={{ color: "red" }}>{verificationStatus}</p>
      )}
      <p>
        Didn't receive the code?{" "}
        <button onClick={handleResendCode}>Resend code</button>
      </p>
    </div>
  );
};

export default VerificationPage;
