import "./Item.css";
import { useRef, useState, useEffect } from "react";

interface ItemProps {
  text: string;
  picture: string;
  claimed: boolean;
  claimedBy: string;
  id: string;
  onDelete: (id: string) => Promise<void>;
}

const Item: React.FC<ItemProps> = ({text, picture, claimed, id, claimedBy, onDelete}) => {

  const claimedRef = useRef<HTMLInputElement>(null);

  console.log("Item claimedBy prop: ", claimedBy);
  console.log("Item claimed state prop: ", claimed);

  const [itemClaimed, setItemClaimed] = useState(claimed);

  console.log("Item claimed state: ", itemClaimed);

  useEffect(() => {
    setItemClaimed(claimed);
  }, [claimed]);

  const updateClaimedAdmin = async () => {
    const confirmed = confirm("Are you sure you want to change the claimed status of this item?");

    if(confirmed) {
      updateClaimed();
    }
  }

  const deleteItem = async () => {
    await onDelete(id);
  }

  const updateClaimed = async () => {
    console.log("Updating claimed status...");
    console.log("Id: ", id);
    console.log(claimedRef.current?.checked);
    try{

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claimed: claimedRef.current?.checked, //The claimed status from the checkbox
          id: id, //The id of the item to update
          claimedBy: sessionStorage.getItem("username") //Username of the claimer
        }
      )}

      const response = await fetch("/api/items/claimed", options);
      setItemClaimed((prev) => !prev);
      return response.json();
    } catch(error){
      console.log("Error updating claimed status:", error);
    }
  }

  //TODO: Show who claimed item and prevent unclaiming unless admin or previous claimer
  return (
    <div className="item">
      <div className="item-text">{text}</div>
      {text !== "Loading items" && text !== "No items" ? 
      <>
        <div className="item-claimed">Claimed by: {itemClaimed ? claimedBy : "No one"}</div>
        {picture !== "" ? <img src={picture} className="item-picture"></img> : null}
        {claimedBy === sessionStorage.getItem("username") || !itemClaimed || sessionStorage.getItem("admin") === "true" ?
        <>
          <label className="item-claimed-label" htmlFor="item-claimed-checkbox">Claim:</label>
          <input type="checkbox" className="item-claimed-checkbox" checked={itemClaimed} onChange={sessionStorage.getItem("admin") !== "true" ? updateClaimed: updateClaimedAdmin} ref={claimedRef}></input>
        </>
        : null
        }
        {sessionStorage.getItem("admin") === "true" ?
        <div className="item-delete top-right" onClick={deleteItem}>
          🗑︎
        </div>
        : null
        }
      </>
      : null
      }
    </div>
  )
}

export default Item;