import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from "axios";
import AllBlogs from "./AllBlogs";
import StudentProfileEditSection from "./StudentProfileEditSection";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


export const fetchstudentinfo = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/students/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
};

export const fetchallblogs = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/students/blogs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [photo, setPhoto] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const tab = new URLSearchParams(location.search).get("tab");

  const getLikedBlogs = (blogs, studentId) => {
    return blogs.filter((blog) =>
      blog.likes?.includes(studentId)
    );
  };

  const getPostedBlogs = (blogs, studentId) => {
    return blogs.filter((blog) =>
      blog.studentId === studentId
    );
  };

  useEffect(() => {
    const info = async () => {
      try {
        const studentData = await fetchstudentinfo();
        const blogData = await fetchallblogs();
        setStudent(studentData);
        setBlogs(blogData);
        setLoading(false);

        const storedPhoto = localStorage.getItem("profilePhoto");
        if (storedPhoto) setPhoto(storedPhoto);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    info();
  }, []);

  const renderTabContent = () => {
    if (tab === "likedBlogs") {
      const likedBlogs = getLikedBlogs(blogs, student._id);
      return <AllBlogs blogs={likedBlogs} />;
    }

    if (tab === "postedBlogs") {
      const postedBlogs = getPostedBlogs(blogs, student._id);
      return <AllBlogs blogs={postedBlogs} />;
    }

    if(tab==="StudentProfileEditSection"){
      return <StudentProfileEditSection student={student} />;
    }

    return (
      <div className="text-gray-500 text-lg">
        Select a blog tab from the profile panel to view your blogs.
      </div>
    );
  };

  if (loading) return <p className="text-center text-xl font-semibold">Loading profile...</p>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Profile Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 shadow-md p-6 flex flex-col items-center">
        {/* Profile Picture and Name */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={student.profilePic || photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
          />
          <h1 className="text-2xl font-bold text-gray-800 text-center">{student.name}</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            className="cursor-pointer w-full bg-blue-800 hover:scale-105 transition duration-300 text-white py-2 rounded-lg text-base font-medium shadow"
            onClick={() => navigate("?tab=StudentProfileEditSection")}
          >
            Edit Profile
          </button>
          <button
            className="cursor-pointer w-full bg-purple-600 hover:scale-105 transition duration-300 text-white py-2 rounded-lg text-base font-medium shadow"
            onClick={() => navigate("?tab=postedBlogs")}
          >
            Posted Blogs
          </button>
          <button
            className="cursor-pointer w-full bg-pink-600 hover:scale-105 transition duration-300 text-white py-2 rounded-lg text-base font-medium shadow"
            onClick={() => navigate("?tab=likedBlogs")}
          >
            Liked Blogs
          </button>

          <button className="cursor-pointer underline text-blue-600 hover:text-blue-800 font-medium" onClick={()=> navigate('/student/home')}>Home</button>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-6 overflow-y-auto"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Profile;
