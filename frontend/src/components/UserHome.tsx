import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import homepng from '../images/home.png'

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-8 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
              User Dashboard
            </h1>
            <div className="flex flex-col items-center space-y-4">
            <Button
            text="SEND REQUEST"
            color="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate('/user/request')}
          />
          <Button
            text="REQUEST DETAILS"
            color="bg-green-500 hover:bg-green-600"
            onClick={() => navigate('/user/request/details')}
          />
           <Button
            text="LOGOUT"
            color="bg-red-500 hover:bg-red-600"
            onClick={() => {localStorage.removeItem('token'); navigate('/')}}
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