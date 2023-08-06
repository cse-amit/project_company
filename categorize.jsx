
import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";


const useShuffle = (items) => {
  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    
    const array = [...items];
    
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    
    setShuffledItems(array);
  }, [items]);

  return shuffledItems;
};

// returns an object of category names and items
const useCategories = (items, categories) => {
  const [categoryItems, setCategoryItems] = useState({});

  useEffect(() => {
   
    const obj = {};
    
    for (let category of categories) {
      obj[category.name] = [];
    }
    
    for (let item of items) {
      obj[item.category].push(item);
    }
    
    setCategoryItems(obj);
  }, [items, categories]);

  return categoryItems;
};


const Item = ({ item, index, moveItem }) => {
  //  useDrag hook to enable dragging
  const [{ isDragging }, drag] = useDrag({
   
    item: { type: "item", id: item._id, index },
    
    end: (item, monitor) => {
      // Get the drop result from the monitor
      const dropResult = monitor.getDropResult();
   
      if (item && dropResult) {
        
        moveItem(item.id, dropResult.name);
      }
    },
  
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Return  element with drag 
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "10px",
        border: "1px solid black",
        margin: "5px",
      }}
    >
      {item.name}
    </div>
  );
};


const Category = ({ category, items }) => {
  // Use the useDrop hook to enable dropping
  const [{ isOver }, drop] = useDrop({
    
    accept: "item",
    // Define the drop handler
    drop: () => ({ name: category.name }),
    
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  
  return (
    <div
      ref={drop}
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: isOver ? "lightgreen" : "lightblue",
        padding: "10px",
        border: "1px solid black",
        margin: "5px",
      }}
    >
      <h3>{category.name}</h3>
      {items.map((item, index) => (
        <Item key={item._id} item={item} index={index} />
      ))}
    </div>
  );
};


const Question = () => {
 
  const [question, setQuestion] = useState(null);
  
  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState(null);

  //  function to fetch the question data from the server
  const fetchQuestion = async () => {
    try {
      //  GET request to the server
      const response = await axios.get("/api/question");
      
      setQuestion(response.data);
      
      setLoading(false);
    } catch (err) {
     
      setError(err.message);
     
      setLoading(false);
    }
  };

  //  function to move an item from one category to another
  const moveItem = async (itemId, categoryName) => {
    try {
      
      const response = await axios.put("/api/question", {
        itemId,
        categoryName,
      });
      // Set the updated question data as state
      setQuestion(response.data);
    } catch (err) {
      
      setError(err.message);
    }
  };

 
  useEffect(() => {
    fetchQuestion();
  }, []);

  
  if (loading) {
    return <p>Loading...</p>;
  }

 
  if (error) {
    return <p>Error: {error}</p>;
  }

  
  if (question) {
    
    const { items, categories } = question;
    
    const shuffledItems = useShuffle(items);
    
    const categoryItems = useCategories(shuffledItems, categories);

    return (
      <div>
        <h1>{question.title}</h1>
        <p>{question.description}</p>
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: "flex" }}>
            <div style={{ width: "200px" }}>
              {shuffledItems.map((item, index) => (
                <Item
                  key={item._id}
                  item={item}
                  index={index}
                  moveItem={moveItem}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {categories.map((category) => (
                <Category
                  key={category.name}
                  category={category}
                  items={categoryItems[category.name]}
                />
              ))}
            </div>
          </div>
        </DndProvider>
      </div>
    );
  }

  
  return null;
};



// code for the Node.js and Express.js server that uses mongoose:


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();


const app = express();


app.use(express.json());


app.use(cors());

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//  schema 
const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
});


const Item = mongoose.model("Item", itemSchema);


const categorySchema = new mongoose.Schema({
  name: String,
});


const Category = mongoose.model("Category", categorySchema);


const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
});


const Question = mongoose.model("Question", questionSchema);




