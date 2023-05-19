import '../scss/main.scss';
import '../index.html';
import bootstrap from 'bootstrap';

import React, { Component } from "react";
import { createRoot } from 'react-dom/client';
import App from "./components/BlindPrintingSpeedTest";


const root = createRoot(document.querySelector("#root"));
root.render(<App />);








