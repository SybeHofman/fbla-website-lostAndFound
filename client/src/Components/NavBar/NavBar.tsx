import "./NavBar.css"
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);

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
        <a className="navbar-brand navbar-content" href="/">Home</a>
      </div>

      {/* hamburger visible on small screens */}
      <button
        className={`hamburger ${open ? "open" : ""}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/*Right components — on small screens this becomes a vertical menu when .open */}
      <div className={`right-links ${open ? "open" : ""}`}>
        <a className="navbar-content" href="/login">Login</a>
        <a className="navbar-content" href="/signup">Sign Up</a>
        <a className="navbar-content" onClick={logOut} href="/">Log out</a>
      </div>
    </nav>
  )
}

export default NavBar;