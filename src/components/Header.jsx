import PropTypes from "prop-types";
import "../styles/Header.css"

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      
      <button className="header__menu-button" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="header__title">NBA Stats</h1>
    </header>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired, 
};
