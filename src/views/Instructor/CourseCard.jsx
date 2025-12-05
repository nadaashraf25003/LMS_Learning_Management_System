import React from "react";

import DefaultImage from "../../../public/images/default-avatar.png";
function CourseCard({ course, onClick, onRemove, onAddToCart, onEdit }) {
  const imageUrl = course.image
      ? `${import.meta.env.VITE_BASE_URL}${course.image}` // Vite
      : DefaultImage;
      console.log(imageUrl)
  return (
    <div
      className="card card-hover w-full max-w-sm bg-surface rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      onClick={onClick} // ← make the whole card clickable
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          // alt={course.title}
          className="object-cover w-full h-full"
        />
        {!course.isApproved && (
          <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-1 rounded-full">
            Pending
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-text-primary">
          {course.title}
        </h2>
        <p className="text-sm text-text-secondary line-clamp-3">
          {course.description || "No description available"}
        </p>

        {/* Course Stats */}
        <div className="flex flex-wrap gap-2 mt-3 text-sm">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Author: {course.author || "Unknown"}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Rating: {course.rating}
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Price: ${course.price.toFixed(2)}
          </span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Views: {course.views || "0 views"}
          </span>
          <span className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Students: {course.studentsEnrolled || 0}
          </span>
          <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Duration: {course.hours ? `${course.hours} hour${course.hours > 1 ? "s" : ""}` : "N/A"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          {onRemove && (
            <button
              className="btn btn-hover w-full bg-destructive text-white rounded-md py-2 font-medium hover:bg-destructive/80"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                onRemove();
              }}
            >
              Remove
            </button>
          )}
          {onEdit && (
            <button
              className="btn btn-hover w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-primary/80"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit Course
            </button>
          )}
          {onAddToCart && (
            <button
              className="btn btn-hover w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-primary/80"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
