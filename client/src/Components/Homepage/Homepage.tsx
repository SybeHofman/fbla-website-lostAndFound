import HandleItems from "../Item/HandleItems";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

function Homepage() {

  const [id, setId] = useState<string | null>(sessionStorage.getItem("id"));

  useEffect(() => {
    function changeId() {
      console.log("Storage changed, updating id");
      setId(sessionStorage.getItem("id"));
    }

    console.log("Second check", id); 

    window.addEventListener("storage", changeId)

    return () => {
      window.removeEventListener("storage", changeId)
    }
  }, []);

  return (
    <div className="homepage">
      {
        id === null ?
        //Not logged in
        <>
          <div className="login-info">
            <div className="about-text">
              <h1>Welcome to lost and found</h1>
              <h2>The best way to handle your lost and found collection</h2>
            </div>
            <div className="login-buttons center column">
              <Link to="/login">
                <h2 className="login-button">
                  Login
                </h2>
              </Link>
              <p className="center">--------------------------------------------</p>
              <Link to="signup">
                <h2 className="login-button">
                  Signup
                </h2>
              </Link>
            </div>
          </div>



        </> :
        //Logged in
        <HandleItems id={id} />
      }
    </div>
  )
}

export default Homepage;