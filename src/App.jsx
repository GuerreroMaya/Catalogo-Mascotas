import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Catalog from "./Components/Catalog";
import LoadPet from "./Components/LoadPet";
import EditPet from "./Components/EditPet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/load-new-pet" element={<LoadPet />} />
        <Route path="/edit-pet" element={<EditPet />} /> 
      </Routes>
    </Router>
  );
}

export default App;


