import Item from "./Item";

import { useState, useEffect, useRef } from "react";

interface ItemHandlerProps {
  id: string | null;
}

const HandleItems: React.FC<ItemHandlerProps> = (id) => {

  const itemTextRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState([{text: "Loading items", picture: "", claimed: false, claimedBy: "", _id: ""}]);
  const [allItems, setAllItems] = useState([{text: "", picture: "", claimed: false, claimedBy: "", _id: ""}]);

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
        setAllItems([{text: "No items", picture: "", claimed: false, claimedBy: "", _id: ""}]);
      } else{
        setItems(responseJson);
        setAllItems(responseJson);
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

  
  const deleteItem = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this item?");

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

      const response = await fetch("/api/items", options);

      if(!response.ok) {
        console.log("Failed to delete item");
        return;
      }

      fetchItems();
      return;
    } catch(error){
      console.log("Error deleting item: ", error);
    }
  }

  const checkSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let searchTerm = e.target.value.toLowerCase();

    searchTerm = searchTerm.trim();

    //Top items
    let filteredItems = allItems.filter((item) =>
      item.text.toLowerCase().includes(searchTerm)
    )

    const searchTermSplit =  searchTerm.split(" ");

    searchTermSplit.forEach((term) => {
      filteredItems = filteredItems.concat(allItems.filter((item) =>
        item.text.toLowerCase().includes(term) && !filteredItems.includes(item)
      ))
    })

    if(filteredItems.length === 0) {
      filteredItems = [{text: "No items", picture: "", claimed: false, claimedBy: "", _id: ""}];
    }

    setItems(filteredItems);
  }

  useEffect(() => {
    fetchItems();
  }, [id])

  return(
    <>
      <h2>Items</h2>
      <label htmlFor="item-search-input">Search Items:</label>
      <input type="text" id="item-search-input" onChange={checkSearch}></input>
      {items.map((item, index) => (
        <Item text={item.text} picture={item.picture} claimed={item.claimed} claimedBy={item.claimedBy} id={item._id} key={index} onDelete={deleteItem}/>
      ))}

      { id !== null ?
        <>
        <h2>Add items</h2>
        <div className = "item-input">
          <input type = "text" id = "item-input-text" ref={itemTextRef}></input>
          <input type = "file" ref={pictureRef} accept="image/*"></input>
          <button type="submit" onClick={postItem}>SUBMIT</button>
        </div>
        </>
        : null
      }
    </>
  )
}

export default HandleItems;