import "./Item.css";
import { useRef, useState, useEffect } from "react";
import trash from "../../assets/trash.png";

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
  const [claimedByState, setClaimedBy] = useState<string | null>(claimedBy);

  console.log("Item claimed state: ", itemClaimed);

  useEffect(() => {
    setItemClaimed(claimed);
  }, [claimed]);

  useEffect(() => {
    setClaimedBy(claimedBy);
  }, [claimedBy])

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

      setItemClaimed(prev => !prev);
      setClaimedBy(sessionStorage.getItem("username"));
      return response.json();
    } catch(error){
      console.log("Error updating claimed status:", error);
    }
  }

  //TODO: Show who claimed item and prevent unclaiming unless admin or previous claimer
  return (
    <div className="item">
      <div className="item-top">
        <span className="item-text" role="text">{text}</span>
        {sessionStorage.getItem("admin") === "true" ?
        <img className="item-delete top-right" src={trash} onClick={deleteItem}></img>
        : null
        }
      </div>
      {text !== "Loading items" && text !== "No items" ? 
      <>
        <div className="item-claimed">Claimed by: {itemClaimed ? claimedByState : "No one"}</div>
        <div className="picture-holder">
          {picture !== "" ? <img src={picture} className="item-picture"></img> : null}
        </div>
        {(claimedByState === sessionStorage.getItem("username") || !itemClaimed || sessionStorage.getItem("admin") === "true") && sessionStorage.getItem("username") !== null ?
        <div>
          <label className="item-claimed-label" htmlFor="item-claimed-checkbox">Claim:</label>
          <input type="checkbox" className="item-claimed-checkbox" checked={itemClaimed} onChange={sessionStorage.getItem("admin") !== "true" ? updateClaimed: updateClaimedAdmin} ref={claimedRef}></input>
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