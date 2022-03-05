import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/HomePage';
import GamePlay from './Components/GamePlay';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}  />
          <Route path='/game' element={<GamePlay/>}  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
