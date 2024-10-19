import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import homepng from '../images/home.png'
import axios from 'axios';
import { useEffect } from 'react';

const Button = ({ text, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full md:w-64 px-6 py-3 mb-4 text-lg font-semibold text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl ${color}`}
  >
    {text}
    <ArrowRight size={24} />
  </button>
);

export default function Home() {
  const navigate = useNavigate();

  const getProfile = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get('http://localhost:3000/me', {
      headers: {
        token: token
      }
    });

    console.log(response.data);
    if(response.data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-8 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
              Housing Plan Approval Portal
            </h1>
            <div className="flex flex-col items-center space-y-4">
            <Button
              text="REGISTER"
              color="bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate('/register')}
            />
            <Button
              text="LOGIN"
              color="bg-green-500 hover:bg-green-600"
              onClick={() => navigate('/login')}
            />
            </div>
          </div>
          <div className="w-full bg-gray-100">
            <img
              src={homepng}
              alt="Housing illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}