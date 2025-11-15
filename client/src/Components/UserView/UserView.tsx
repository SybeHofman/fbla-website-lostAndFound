import "./UserView.css"
import { useState, useEffect } from "react";
import User from "./User";

interface UserViewProps {
  id: string | null;
}

const UserView: React.FC<UserViewProps> = (id) => {
  
  const [users, setUsers] = useState([{username: "Loading users", id: "", admin: false}]);

  const fetchUsers = async () => {
    try{
      const response = await fetch("/api/users");
      if(!response.ok) {
        console.log("Failed to fetch users");
        return;
      }

      const responseJson = await response.json();
      if(responseJson.length === 0) {
        setUsers([{username: "No users", id: "", admin: false}]);
      } else{
        setUsers(responseJson);
      }
    } catch(error) {
      console.log("Error fetching users:", error);
    }
  }

  const deleteItem = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");

    if(!confirmed) {
      return;
    }
    
    try{
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id, //The id of the item to delete
        }
      )}

      const response = await fetch("/api/users", options);

      if(!response.ok) {
        console.log("Failed to delete item");
        return;
      }

      fetchUsers();
      return;
    } catch(error){
      console.log("Error deleting item: ", error);
    }
  }

  useEffect(() => {
    fetchUsers();

    console.log(users);
  }, [id])

  return (
    <div className = "user-view">
      {users.map((item, index) => (
        <User username={item.username} id={item.id} admin={item.admin} onDelete={deleteItem} key={index}/>
      ))}
    </div>
  )
}

export default UserView;