import { preconnect } from "react-dom";
import "./Item.css";
import { useRef, useState } from "react";

interface ItemProps {
  text: string;
  picture: string;
  claimed: boolean;
  claimedBy: string;
  id: string;
}

const Item: React.FC<ItemProps> = ({text, picture, claimed, id, claimedBy}) => {

  const claimedRef = useRef<HTMLInputElement>(null);

  const [itemClaimed, setItemClaimed] = useState(claimed);

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
          claimed: claimedRef.current?.checked,
          id: id
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
        (
        <>
          <div className="item-claimed">{itemClaimed + ""}</div>
          {picture !== "" ? <img src={picture} className="item-picture"></img> : null}
          <label className="item-claimed-label" htmlFor="item-claimed-checkbox">Claim:</label>
          <input type="checkbox" className="item-claimed-checkbox" checked={itemClaimed} onChange={updateClaimed} ref={claimedRef}></input>
        </>
        ) : null
      }
    </div>
  )
}

export default Item;