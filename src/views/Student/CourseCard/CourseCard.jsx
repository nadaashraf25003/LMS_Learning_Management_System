// React
import React from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router";
import DefaultImage from "../../../../public/images/default-avatar.png";
const CourseCard = ({ course, onRemove, onAddToCart }) => {
  const location = useLocation().pathname.split("/").pop();
   const imageUrl = course.image
        ? `${import.meta.env.VITE_BASE_URL}${course.image}` // Vite
        : DefaultImage;

  return (
    <div className="flex max-md:flex-col border rounded-lg p-4 w-full max-w-4xl items-center gap-6 card relative card-hover">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(course.id)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full  cursor-pointer
            bg-secondary hover:bg-[#e9965c] text-footer-text  transition max-md:hidden"
      >
        <Trash2 size={16} />
      </button>

      {/* Image Section */}
      <Link
        to={`/StudentLayout/StuCourseDetails/${course.id}`}
        className="relative w-72 h-40 overflow-hidden rounded-md max-md:w-full max-md:h-48 block"
      >
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
          ⭐ {course.rating}
        </div>

        {/* Tag */}
        <span className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
          {course.tag}
        </span>
        <span className="absolute bottom-2 right-2 bg-gray-200 text-sm px-3 py-1 rounded mb-2 text-black">
          {course.hours}
        </span>
      </Link>

      <div>
        {/* Content */}
        <div className="flex-1">
          <div className="text-text-secondary text-sm">
            <span>{course.views}</span> • <span>{course.posted}</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mt-1">
            {course.title}
          </h3>
          <div className="text-text-secondary text-sm mt-1">
            {course.category}
          </div>
          <div className="flex justify-between">
            <div className="text--text-secondary text-sm font-bold mt-1">
              By {course.author}
            </div>
            <span className="text-lg font-bold mb-2">{course.price}</span>
          </div>
        </div>

        {/* Footer + Add to Cart */}
        <div className="flex justify-end  max-md:justify-between ">
          {/* ✅ Add to Cart Button */}
          <button
            onClick={() => onRemove(course.id)}
            className="hidden items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition max-md:flex"
          >
            <Trash2 size={16} />
          </button>

          {location !== "StuShoppingCart" && location !== "MyCourses" && (
            <button
              onClick={() => onAddToCart(course)}
              className="flex items-center gap-2  btn-primary card-hover"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
