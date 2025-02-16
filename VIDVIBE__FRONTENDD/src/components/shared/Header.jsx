import "./Header.css";

const NAV_HEADER = () => {
    const searchIcon="../src/assets/search.png"
  return (
    <>
      <div className="nav_header">
        <div className="logo_menu_div">
          <button className="menu_button">
            <div>
              <span className="material-symbols-outlined">menu</span>
            </div>
          </button>

          <div className="logo_img">
            <img src="../src/assets/logo_1_01.png" alt="VidVibe" />
          </div>
        </div>
        <div className="searchBar_div">
          <div className="outter_search_bar">
            <form>
              <input placeholder="Search" className="input_box" />
            </form>
          </div>
          <div className="search_icon">
            <img src={searchIcon} />
          </div>
        </div>
        <div className="userInfo_div">
          <div className="create_upload">
            <img className="plus_icon" src="../src/assets/plus.png" />
            <span className="font_create">Create</span>
          </div>
          <div className="user_logo">U</div>
        </div>
      </div>
    </>
  );
};

export default NAV_HEADER;
