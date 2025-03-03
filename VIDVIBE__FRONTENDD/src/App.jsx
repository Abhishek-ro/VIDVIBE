import "./App.css";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NAV_HEADER from "./components/shared/Header.jsx";

function App() {
  return (
    <Router>
      {" "}
      <NAV_HEADER />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
