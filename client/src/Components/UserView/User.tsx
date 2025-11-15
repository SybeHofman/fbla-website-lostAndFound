import "./User.css"

interface UserProps {
  username: string;
  id: string;
  admin: boolean;
  onDelete: (id: string) => Promise<void>;
}

const User: React.FC<UserProps> = ({username, id, admin, onDelete}) => {

  const deleteUser = () => {
    onDelete(id);
  }

  return (
    <div className="user-card">
      <h3 className="username">{username}</h3>
      {username !== "Loading users" && username !== "No users" ?
      <>
        <div className="admin">admin: {admin + ""}</div>
        <button className="delete-user-button" onClick={deleteUser}>Delete User</button>
      </>
      : null
      }
    </div>
  )
}

export default User;