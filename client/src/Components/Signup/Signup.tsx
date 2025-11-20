import {Link, useNavigate} from "react-router-dom";
import "./Signup.css";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";

function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [usernameExists, setUsernameExists] = useState<boolean>(false);
  const [addedStuff, setAddedStuff] = useState<boolean>(true);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if(usernameRef.current == null || passwordRef.current == null) {
      console.error("Username or password input is null");
      setAddedStuff(false);
      return;
    }

    if(usernameRef.current.value === "" || passwordRef.current.value === "") {
      console.error("Username or password is empty");
      setAddedStuff(false);
      return;
    }
    
    await postData(usernameRef.current?.value, passwordRef.current?.value);
    await authenticate(usernameRef.current?.value, passwordRef.current?.value);

    navigate("/");
  }

  const postData = async (username: string, password: string) => {
    console.log("Adding a new user!");
    const list = {username: username, password: password}
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(list)
    }

    const response = await fetch("/api/users", options);

    const data = await response.json();

    if(data === "Username already exists") {
      setUsernameExists(true);
      return;
    }

    console.log(data);
  }

  const authenticate = async (username: string, password: string) => {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, password})
    }

    const response = await fetch("/api/users/authenticate", options);

    if(!response.ok) {
      console.log("Authentication failed");
      return;
    }

    const user = await response.json();
    console.log(user);

    sessionStorage.setItem("id", JSON.stringify(user._id).replaceAll("\"", ""));
    sessionStorage.setItem("username", JSON.stringify(user.username).replaceAll("\"", ""));
    sessionStorage.setItem("admin", JSON.stringify(user.admin));
  }

  return (
    <div className="login-info signup">
      <div className="signup-left">
        <h1>Welcome to Lost and Found!<br/>Please signup with username and password</h1>
        <h2>Already have an account?</h2>
        <Link to="/login"><h2 className="to-login">Login</h2></Link>
      </div>
      <div className = "signup-form">
        <label className="signup-contents" htmlFor = "usernameInput">Username: </label><br/>
        <input ref={usernameRef} className="signup-contents" type="text" id="usernameInput" aria-label="Input one of two"></input><br/>

        {usernameExists ?
        <div className="signup-contents error">
          Username already exists
        </div>
        : null} 

        <label className="signup-contents" htmlFor = "passwordInput">Password: </label><br/>
        <input ref={passwordRef} className="signup-contents" type="password" id="passwordInput" aria-label="Input two of two"></input><br/>

        {!addedStuff ?
        <div className="signup-contents error">
          Include username and password
        </div>
        : null
        }
        
        <button className="signup-contents" type="submit" onClick={handleClick}>Submit</button>
      </div>
    </div>
  )
}

export default Signup;