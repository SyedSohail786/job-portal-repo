import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const WrongRoute = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-6">
      <div className="text-center text-white max-w-md">
        <h1 className="text-8xl font-extrabold drop-shadow-lg mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Oops! Page not found</p>
        <p className="text-blue-200 mb-6">
          The page you're looking for might have been removed or doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default WrongRoute;
