import HandleItems from "../Item/HandleItems";

function Homepage() {
  const _id = sessionStorage.getItem("_id");

  return (
    <>
      {
        _id === null ?
        //Not logged in
        <>
          <h1>Welcome to lost and found!</h1>
        </> :
        //Logged in
        <HandleItems _id={_id} />
      }
    </>
  )
}

export default Homepage;