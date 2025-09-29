import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="relative z-10 text-center px-6 py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 drop-shadow-md">
          Welcome to UConnect
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-blue-800">
          Connect with your campus community, find lost items, keep the campus clean, and enhance your university experience.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition transform hover:-translate-y-1 hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-green-400 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition transform hover:-translate-y-1 hover:scale-105"
          >
            Register
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">LostButFoundApp</h2>
            <p className="text-blue-800">
              Post pictures of items you lost or found. When there’s a match, connect directly with the finder or owner. Never lose your stuff again!
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Green Campus</h2>
            <p className="text-blue-800">
              Promote a cleaner campus! Share your tips, dispose responsibly, and learn how to contribute to a greener environment.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Community & Awareness</h2>
            <p className="text-blue-800">
              Engage with fellow students, stay informed, and help build a connected, responsible, and lively campus community.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 mt-12 bg-blue-900 text-yellow-400 font-semibold">
        © {new Date().getFullYear()} UConnect - University of Ilorin Inspired
      </footer>
    </div>
  );
}
