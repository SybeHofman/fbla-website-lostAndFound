import HandleItems from "../Item/HandleItems";
import { useEffect, useState } from "react";

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
    <>
      {
        id === null ?
        //Not logged in
        <>
          <h1>Welcome to lost and found!</h1>
        </> :
        //Logged in
        <HandleItems id={id} />
      }
    </>
  )
}

export default Homepage;