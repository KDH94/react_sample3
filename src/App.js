import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
