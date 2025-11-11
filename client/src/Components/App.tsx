import "./App.css";
import Login from "./Login/Login.tsx";
import Signup from "./Signup/Signup.tsx";
import Homepage from "./Homepage/Homepage.tsx";
import NavBar from "./NavBar/NavBar.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const _id = localStorage.getItem("_id") || sessionStorage.getItem("_id");

  if(_id === null) {
    console.log("No user logged in");
  }

  return (
    <>
      <NavBar></NavBar>
      <div className = "app-content">
        <BrowserRouter>
          <Routes>
            
            <Route path="/" element={<Homepage/>}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;