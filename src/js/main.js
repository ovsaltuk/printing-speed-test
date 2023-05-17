import '../scss/main.scss';
import '../index.html';
import bootstrap from 'bootstrap';

import React, { Component } from "react";
import { createRoot } from 'react-dom/client';
import App from "./components/MyComponent";


const root = createRoot(document.querySelector("#root"));
root.render(<App />);

// axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=5&format=text')
//   .then(response => {
//     // console.log(response.data);
    
//   })
//   .catch(error => {
//     console.log(error);
//   });







