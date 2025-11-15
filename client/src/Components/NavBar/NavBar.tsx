import "./NavBar.css"
import { useState, useEffect } from "react";

import logo from "../../assets/logo.png";

function NavBar() {
  const [open, setOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState<string | null>(sessionStorage.getItem("admin"));
  
  useEffect(() => {
    function changeAdmin() {
      console.log("Storage changed, updating admin");
      setIsAdmin(sessionStorage.getItem("admin"));
    }

    console.log("Second check", isAdmin); 

    window.addEventListener("storage", changeAdmin)

    return () => {
      window.removeEventListener("storage", changeAdmin)
    }
  }, []);

  const logOut = () => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("admin");
    // close menu on logout (mobile)
    setOpen(false);
  }

  return(
    <nav className = "navbar">
      <div className="navbar-left">
        <a className="navbar-brand navbar-content" href="/">
          <img className="navbar-logo" src={logo}></img>
        </a>
      </div>

      <button
        className={`hamburger ${open ? "open" : ""}`}
        aria-label="Toggle navbar"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      <div className={`right-links ${open ? "open" : ""}`}>
        { isAdmin === "true" ? <a className="navbar-content" href="/userview">View users</a> : null }
        <a className="navbar-content" href="/login">Login</a>
        <a className="navbar-content" href="/signup">Sign Up</a>
        <a className="navbar-content" onClick={logOut} href="/">Log out</a>
      </div>
    </nav>
  )
}

export default NavBar;