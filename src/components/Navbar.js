import Slider from "./Switch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const formattedDay = currentDateTime.toLocaleDateString(undefined, {
    weekday: 'long'
  });

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric'
  });

  const handleCGClick = (CG) => {
    navigate('/')
  }

  return (
    <div className="text-white h-12 fixed top-0 w-full bg-gray-800 p-4 flex items-center justify-between" onClick={() => handleCGClick()}>
      <div className="flex-1 ">
        <span className="bg-blue-500 rounded-full p-2 border-2 border-white text-white hover:bg-white hover:text-black">Crypto-Go</span>
        <span className="ml-2">{formattedDay}, {formattedTime}</span>
      </div>
    
      <div className="flex items-center">
        <div className="mr-2">Light</div>
        <Slider />
        <div className="ml-2">Dark</div>
      </div>
    </div>
  );
}

export default Navbar;
