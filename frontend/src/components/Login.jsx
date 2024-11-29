import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isSignup, setIsSignup] = useState(false); 

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
     
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);

      try {
        await dispatch(signup(formData)).unwrap(); 
        setIsSignup(false); 
        setEmail("");
        setPassword("");
        setUsername("");
        setFullName("");
        setAvatar(null);
        setCoverImage(null);
        navigate("/login"); 
      } catch (err) {
        console.log(err);
        
      }
    } else {
      dispatch(login({ email, password, username }));
      navigate("/dashboard"); 
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setUsername("");
    setFullName("");
    setAvatar(null);
    setCoverImage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Signup" : "Login"}
        </h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {isSignup && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Full Name:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Avatar:</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  accept="image/*"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Cover Image:</label>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-2 rounded text-white ${
              status === "loading" ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            } transition-colors duration-300`}
          >
            {status === "loading"
              ? isSignup
                ? "Signing up..."
                : "Logging in..."
              : isSignup
              ? "Signup"
              : "Login"}
          </button>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-500 font-semibold hover:underline"
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
