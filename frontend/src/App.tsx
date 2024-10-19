import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from '@/components/Home.tsx';
import Register from '@/components/Register.tsx';
import Login from './components/Login.tsx';
import UserRequest from '@/components/UserRequest.tsx';
import UserRequestDetails from '@/components/UserRequestDetails.tsx';
import UserHome from '@/components/UserHome';
import AdminHome from '@/components/AdminHome.tsx';
// import Navbar from '@/components/Navbar.tsx';
import About from '@/components/About.tsx';

function App() {
  return (
<>
        {/* <Route path="/navbar" element={<Navbar />} /> */}
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={<UserHome />} />
        <Route path="/user/request" element={<UserRequest />} />
        <Route path="/user/request/details" element={<UserRequestDetails />} />
        
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
</>
  );
}

export default App;
