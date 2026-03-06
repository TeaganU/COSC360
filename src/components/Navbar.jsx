import { Link, useNavigate } from 'react-router-dom';
import Searchbar from "./Searchbar";

export default function Navbar() {
  const isLoggedIn = false; // placeholder
  return (
    <nav className="bg-white border-b  px-8 py-4 flex justify-between items-center ">
      <div className="font-bold text-lg flex gap-6 items-center">
        Outdoor Skill Sharing
        <Searchbar />
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/skills">Skills</Link>
        
        {isLoggedIn ? (
          <Link
            to="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
          >
            JD
          </Link>
        ) : (
          <>
            <Link 
              to="/login"
            >
              Login
            </Link>

            <Link 
              to="/signup" 
              className="bg-black text-white px-4 py-1 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
