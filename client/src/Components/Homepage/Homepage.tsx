import HandleItems from "../Item/HandleItems";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import magnifyingGlass from "../../assets/magnifying-glass.png";
import book from "../../assets/open-book.png";
import githubLogo from "../../assets/github-mark.svg";

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
      { id === null ?
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
      :
      <div className="login-info">
        <h1 className="center">
        You're all signed in!<br/>
        Feel free to click on one of the links at the bottom or on the navbar to go around the website
        </h1>
      </div>
      }
      
      <div className="bottom-links">
        <Link to="items" className="bottom-link">
          <div className="see-items bottom-link">
            <img src={magnifyingGlass} className="bottom-img"></img>
            See items
          </div>
        </Link>
        <Link to="sources" className="bottom-link">
          <div className="see-sources bottom-link">
            <img src={book} className="bottom-img"></img>
            See sources
          </div>
        </Link>
        <a href="https://github.com/SybeHofman/fbla-website-lostAndFound" target="_blank" className="bottom-link">
          <div className="see-about bottom-link">
            <img src={githubLogo} className="bottom-img"></img>
            See source code
          </div>
        </a>
      </div>
    </div>
  )
}

export default Homepage;