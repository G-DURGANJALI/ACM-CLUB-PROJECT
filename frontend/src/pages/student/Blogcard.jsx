import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShareButton from "./ShareSocially"; 

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const blogUrl = `${window.location.origin}/blog/${blog._id}`;

  const handleReadMore = (blogId) => {
    navigate(`/student/home?tab=fullcard&id=${blogId}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden 
                 transform transition-transform duration-300 hover:scale-105 
                 hover:shadow-xl cursor-pointer flex flex-col"
    >
      <img
        src={blog.coverimg}
        alt="cover"
        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {blog.title}
        </h3>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{blog.likes.length}</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();  // Prevents triggering the blog click event
            }}
            className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
          >
            <ShareButton url={blogUrl} title={blog.title} />
          </div>
        </div>

        <button
          onClick={() => handleReadMore(blog._id)}
          className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Read
        </button>
      </div>
    </div>
  );
};

export default BlogCard;