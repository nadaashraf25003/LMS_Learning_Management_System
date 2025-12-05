import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLesson from "@/hooks/useLesson";
import toast, { Toaster } from "react-hot-toast";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";

export default function CreateLesson() {
  const { courseid: courseId } = useParams();
  console.log("courseId", courseId);

  const navigate = useNavigate();
  const { addLessonMutation } = useLesson();

  const [form, setForm] = useState({
    title: "",
    description: "",  
    videoUrl: "",
    duration: "",
    contentType: "",
    isFreePreview: false,
    thumbnail: "",
    attachmentUrl: "",
    order: 0,
  });
  console.log(form)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return toast.error("Course ID missing!");

    setIsSubmitting(true);
    try {
      await addLessonMutation.mutateAsync({
        ...form,
        courseId: Number(courseId),
      });
      toast.success("Lesson created successfully!");
      navigate(`/InstructorLayout/InstCourseDetails/${courseId}`);
    } catch (err) {
      toast.error("Failed to create lesson. Check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <Toaster position="top-center" />
      <div className="custom-container">
        <div className="max-w-2xl mx-auto">
          <div className="card border border-border p-8 space-y-6">
            <LandingHeading header="Create New Lesson" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Basic Information
                </h3>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter lesson title"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Lesson Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide a brief description of this lesson..."
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Lesson Order in Course *
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Lesson Content
                </h3>
                
                {/* Lesson Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Lesson Type *
                  </label>
                  <select
                    name="lessonType"
                    value={form.lessonType}
                    onChange={handleChange}
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="video">Video Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="pdf">PDF Material</option>
                    <option value="task">Assignment</option>
                  </select>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/video.mp4"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Duration
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="10 (minutes)"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Media & Attachments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Media & Attachments
                </h3>
                
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Attachment URL
                  </label>
                  <input
                    type="url"
                    name="attachmentUrl"
                    value={form.attachmentUrl}
                    onChange={handleChange}
                    placeholder="PDF / ZIP / Resource Link"
                    className="w-full border border-input bg-background text-text-primary p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Lesson Settings
                </h3>
                
                {/* Free Preview */}
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/50">
                  <input
                    type="checkbox"
                    name="isFreePreview"
                    checked={form.isFreePreview}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
                  />
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      Enable Free Preview
                    </label>
                    <p className="text-xs text-text-secondary mt-1">
                      Allow students to view this lesson without enrollment
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn btn-primary btn-hover py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Lesson...
                    </span>
                  ) : (
                    "Create Lesson"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 btn bg-transparent border border-input text-text-primary btn-hover py-3 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Preview Card */}
          {form.title && (
            <div className="card border border-border mt-6 p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Lesson Preview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Title:</span>
                  <span className="text-text-primary font-medium">{form.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Type:</span>
                  <span className="text-text-primary font-medium capitalize">{form.lessonType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-text-primary font-medium">{form.duration || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Free Preview:</span>
                  <span className={`font-medium ${form.isFreePreview ? 'text-green-600' : 'text-text-secondary'}`}>
                    {form.isFreePreview ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}