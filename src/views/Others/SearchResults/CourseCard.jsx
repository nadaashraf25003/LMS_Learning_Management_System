import DefaultImage from "../../../../public/images/default-avatar.png";
export default function CourseCard({ course, onClick }) {
  const imageUrl = course.image
    ? `${import.meta.env.VITE_BASE_URL}${course.image}` // Vite
    : DefaultImage;
  // console.log(course)
  return (
    <div
      className="group bg-[var(--color-card)] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 cursor-pointer animate-fade-in-up h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
        <img
          src={course.image ? course.image : DefaultImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges Container */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Certificate Badge - Left */}
          {course.certificateIncluded && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span className="text-sm">📜</span>
              Certificate
            </div>
          )}

          {/* Tag - Right */}
          <div className="bg-[var(--color-secondary)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg capitalize ml-auto">
            {course.tag || "Featured"}
          </div>
        </div>

        {/* Duration - Bottom */}
        <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
          <span className="text-sm">⏱️</span>
          {course.duration}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        {/* Title and Description */}
        <div className="space-y-3 flex-grow">
          <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-200 leading-tight">
            {course.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
            {course.description || "No description available."}
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-xs">
            👤
          </span>
          <span className="truncate">By {course.author}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Rating */}
          {/* <div className="flex items-center gap-2 bg-[var(--color-surface)] px-3 py-1.5 rounded-full border border-[var(--color-border)] flex-1 min-w-0">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <span className="text-sm">⭐</span>
              <span className="text-xs">{course.rating?.toFixed(1) ?? "-"}</span>
            </div>
            <span className="text-[var(--text-secondary)] text-xs truncate">rating</span>
          </div> */}

          {/* Students */}
          {/* <div className="flex items-center gap-2 bg-[var(--color-surface)] px-3 py-1.5 rounded-full border border-[var(--color-border)] flex-1 min-w-0 justify-center">
            <span className="text-sm">👥</span>
            <span className="text-[var(--text-primary)] font-semibold text-xs">{course.studentsEnrolled || 0}</span>
          </div> */}

          {/* Views */}
          {/* <div className="flex items-center gap-2 bg-[var(--color-surface)] px-3 py-1.5 rounded-full border border-[var(--color-border)] flex-1 min-w-0 justify-center">
            <span className="text-sm">👀</span>
            <span className="text-[var(--text-primary)] font-semibold text-xs">{course.views}</span>
          </div> */}
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
          {/* Price */}
          <div
            className={`text-base font-bold flex items-center gap-1 ${
              course.price === 0
                ? "text-green-600"
                : "text-[var(--color-primary)]"
            }`}
          >
            {course.price === 0 ? (
              <>
                <span className="text-lg">🎁</span>
                <span>Free</span>
              </>
            ) : (
              <>
                <span className="text-lg">💰</span>
                <span>${course.price}</span>
              </>
            )}
          </div>

          {/* Category Tag */}
          {course.category && (
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold px-2 py-1 rounded-full border border-[var(--color-primary)]/20 truncate flex-1 text-center">
              {course.category}
            </span>
          )}

          {/* Posted Date */}
          {course.createdAt && (
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] bg-[var(--color-surface)] px-2 py-1 rounded-full flex-shrink-0">
              <span className="text-sm">📅</span>

              <span className="truncate">
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
