import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
function UserForm() {
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState(null);
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();
  
  function handleSubmit(e) {
    e.preventDefault();
    const trimmedInput = inputName.trim();
    if (trimmedInput === '') {
      setError('Please enter a name');

    }
    // Check if the input contains only letters. for more info check obsidian notes error11102024.md
    else if (!/^[a-zA-Z]+$/.test(trimmedInput)) {
      setError('Invalid input. Please enter a string');
    } else {
      setName(trimmedInput);
      navigate('/quiz');
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
    }
  }
  
  return (
    // Add the form here
    <form onSubmit={handleSubmit} >
      <label >
        Name:
        <input 
          type="text"
          value={inputName}
          placeholder='Your Name'
          onChange={(e) => setInputName(e.target.value)}
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
  
}
export default UserForm;