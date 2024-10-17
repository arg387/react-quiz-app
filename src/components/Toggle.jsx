import "./Toggle.css";
import PropTypes from 'prop-types';

export const Toggle=({handleChange, isChecked})=>{ 
  return (
    <div className="toggle-container">
      <input type="checkbox" id="check" onChange={handleChange} checked={isChecked} className="toggle"/>
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
}

Toggle.propTypes = {
  handleChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired
}