import Item from "./Item";

import { useState, useEffect, useRef } from "react";

interface ItemHandlerProps {
  _id: string | null;
}

const HandleItems: React.FC<ItemHandlerProps> = (_id) => {

  const itemTextRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState([{text: "Loading items", picture: "", claimed: false, claimedBy: "", _id: ""}]);

  //Fetchs all items
  const fetchItems = async () => {
    try{
      const response = await fetch("/api/items");
      if(!response.ok) {
        console.log("Failed to fetch items");
        return;
      }

      const responseJson = await response.json();
      if(responseJson.length === 0) {
        setItems([{text: "No items", picture: "", claimed: false, claimedBy: "", _id: ""}]);
      } else{
        setItems(responseJson);
      }
    } catch(error) {
      console.log("Error fetching items:", error);
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  //Post items
  const postItem = async () => {

    const text = itemTextRef.current?.value;
    const pictures = pictureRef.current?.files ?? null;

    if(!pictures){
      console.log("No picture selected");
      return;
    }

    const picture = pictures[0];

    //Convert picture to base64
    const pictureBase64 = await fileToBase64(picture);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({text: text, picture: pictureBase64})
    }

    const response = await fetch("/api/items", options);
    if(!response.ok) {
      console.log("Failed to post message");
      return;
    }

    console.log(JSON.stringify(response.body));

    fetchItems();

    return response.json();
  }

  useEffect(() => {
    fetchItems();
  }, [_id])
  return(
    <>
      <h2>Items</h2>
      {items.map((item, index) => (
        <Item text={item.text} picture={item.picture} claimed={item.claimed} claimedBy={item.claimedBy} id={item._id} key={index} />
      ))}

      <h2>Add items</h2>
      <div className = "item-input">
        <input type = "text" id = "item-input-text" ref={itemTextRef}></input>
        <input type = "file" ref={pictureRef} accept="image/*"></input>
        <button type="submit" onClick={postItem}>SUBMIT</button>
      </div>
    </>
  )
}

export default HandleItems;