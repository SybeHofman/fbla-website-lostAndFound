import "./Login.css";
import {Link, useNavigate} from "react-router-dom";
import { useRef } from "react";
import type { MouseEvent } from "react";

function Login () {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleClick = async (_: MouseEvent<HTMLButtonElement>) => {

    if(usernameRef.current == null || passwordRef.current == null) {
      console.error("Username or password input is null");
      return;
    }

    if(usernameRef.current.value === "" || passwordRef.current.value === "") {
      console.error("Username or password is empty");
      return;
    }

    await authenticate(usernameRef.current?.value, passwordRef.current?.value);
    navigate("/");
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
    <>
      <div className = "login-info login">
        <div className="login-left">
          <h1>Welcome <br/> Please login to your account</h1>
          <h2>New to lost and found?</h2>
          <Link to="/signup"><h2 className="to-signup">Signup</h2></Link>
        </div>
        <div>
          <label className="login-contents" htmlFor = "usernameInput">Username: </label> <br/>
          <input ref={usernameRef} className="login-contents" type="text" id="usernameInput" aria-label="Input one of two"></input><br/>

          <label className="login-contents" htmlFor = "passwordInput">Password: </label> <br/>
          <input ref = {passwordRef} className="login-contents" type="password" id="passwordInput" aria-label="Input two of two"></input><br/>

          <button className="login-contents" type="submit" onClick={handleClick}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default Login;