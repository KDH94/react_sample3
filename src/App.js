import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import WriteBoard from './pages/WriteBoard';
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
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/write" element={<WriteBoard/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
