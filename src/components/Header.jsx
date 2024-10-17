import {Link} from "react-router-dom";

function Header() {

  return (
    <>
    <div >
      <h1>Which Element Are You?</h1>
      <p>(Based on completely random things...)</p> 
      <nav>
        <Link to="/">Home</Link> 
        <Link to="/quiz">Quiz</Link>
      </nav>
    </div>
    </>
  )
}

export default Header;