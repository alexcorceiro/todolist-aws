import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/inscription" element={<Register/>} />
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
