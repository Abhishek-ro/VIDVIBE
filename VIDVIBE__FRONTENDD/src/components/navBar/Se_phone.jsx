import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Se_phone.css";
import useTheme from "../../contexts/theme.js";
import { useSnackbar } from "notistack";
function Se_phone({ onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { themeMode } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const handleBack = () => {
    navigate(-1);
    if (onClose) onClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchVideo = async () => {
    const trimmedQuery = searchTerm.trim();
    if (!trimmedQuery) return;

    try {
      navigate(`/video/search?query=${encodeURIComponent(trimmedQuery)}`);
      if (onClose) onClose(); 
    } catch (error) {
      enqueueSnackbar("Search failed!!!", {
        variant: "error",
      });
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await searchVideo();
  };

  return (
    <div className={`se-phone-fullscreen ${themeMode}`}>
      <div className="se-phone-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default Se_phone;
