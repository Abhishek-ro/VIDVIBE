import "./Auth.css";
import logo from "../assets/logo.jpg";
// import {Register}  from "../components/auth/Register.jsx";
// import { Login } from "../components/auth/Login.jsx";
import {useState} from "react";

export default function Auth() {
  const [isRegister,setIsRegister]= useState(true)
  const login =()=>{
    setIsRegister(()=> false)
  }
  const signup =()=>{
    setIsRegister(()=> true)
  }
  return (
    <div className="Auth_main">
      {/* LEFT SIDE IMAGE */}
      <div className="left_main_image_div">
        <div className="black_overlayer">
          <blockquote className="auth_quote">
            {'"Unlock endless possibilities—watch, create, and inspire!"'}
            <br />
            <span className="quote_owner">-ABHI</span>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="right_side_auth">
        <div className="logo_col">
          <img src={logo} alt="VIDVIBE" className="logo" />
          <h1 className="brandName">VIDVIBE</h1>
        </div>
        <div>
          <h2 className="register_user_title">
            {isRegister ? "CREATE ACCOUNT" : "LOGIN TO ACCOUNT"}
          </h2>
        </div>
        {/* {isRegister ? <Register /> : <Login />} */}
        <div className="acc_exist">
          <p className="para"> {isRegister?`Already have an account?`:"Don't have an account?"}</p>
          <a href="#" onClick={isRegister?login:signup} className="link-para">
            {isRegister?"Login":"Signup"}
          </a>
        </div>
      </div>
    </div>
  );
}
