 // code for the React component that uses react-bootstrap:


import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";


const Question = () => {
  
  const [question, setQuestion] = useState(null);
  
  const [answer, setAnswer] = useState({});
  
  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  // function to fetch the question data from the server
  const fetchQuestion = async () => {
    try {
      // Send a GET request to the server
      const response = await axios.get("/api/question");
      
      setQuestion(response.data);
      
      setLoading(false);
    } catch (err) {
      
      setError(err.message);
     
      setLoading(false);
    }
  };

  //  function to handle the change of user answer
  const handleChange = (e) => {
    // Get the name and value 
    const { name, value } = e.target;
    
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      [name]: value,
    }));
  };

  //  function to handle the submission of user answer
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      
      const response = await axios.post("/api/question", answer);
      
      setFeedback(response.data.message);
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

  
