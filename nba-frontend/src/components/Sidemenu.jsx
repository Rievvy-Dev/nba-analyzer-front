import PropTypes from "prop-types";
import { FaHome, FaBasketballBall, FaUsers, FaUser } from "react-icons/fa";
import "../styles/Sidemenu.css";

export default function Sidemenu({ isOpen, onClose }) {
  console.log("Classe aplicada ao Sidemenu:", isOpen ? "sidemenu--open" : "");

  return (
    <div className={`sidemenu ${isOpen ? "sidemenu--open" : ""}`}>
      <button className="sidemenu__close-button" onClick={onClose}>
        ☰
      </button>
      <nav className="sidemenu__nav">
        <ul>
          <li><a href="/"><FaHome /> Home</a></li>
          <li><a href="#"><FaBasketballBall /> New York Knicks</a></li>
          <li><a href="/teams"><FaUsers /> Teams</a></li>
          <li><a href="#"><FaUser /> Players</a></li>
        </ul>
      </nav>
    </div>
  );
}

Sidemenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
