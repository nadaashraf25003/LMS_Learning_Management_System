import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/app";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";
import CourseService from "@/store/Classes/Course";

function CreateCourse() {
  const courseService = new CourseService();
  const { saveLoading, setSaveLoading } = useAppStore();
  const { courseid } = useParams(); //  Get course ID from URL
  console.log("Course ID from URL:", courseid);
  const navigate = useNavigate();
  const isEdit = Boolean(courseid); //  Edit mode flag

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    hours: "",
    price: 0,
    tag: "",
    image: "",
    certificateIncluded: false,
    durationNumber: "",
    durationUnit: "",
  });

  //  Load course data if editing
  useEffect(() => {
    if (!isEdit) return;
    loadCourse();
  }, [courseid]);

  const loadCourse = async () => {
    try {
      const course = await courseService.getCourseById(courseid);
      if (course) {
        const [durationNumber, durationUnit] = (course.duration || "").split(
          " "
        );
        setForm({
          ...course,
          description: course.description || "",
          durationNumber: durationNumber || "",
          durationUnit: durationUnit || "",
        });
      }
    } catch {
      toast.error("Failed to load course");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      const submitForm = {
        ...form,
        duration: `${form.durationNumber || ""} ${
          form.durationUnit || ""
        }`.trim(),
        description: form.description || "", // ensure never null
      };

      let result;
      if (isEdit) {
        result = await courseService.updateCourse(courseid, submitForm);
      } else {
        result = await courseService.addCourse(submitForm);
      }

      if (result) {
        toast.success(
          isEdit
            ? "Course updated successfully!"
            : "Course submitted successfully! Waiting for approval."
        );
        if (!isEdit) {
          setForm({
            title: "",
            description: "",
            category: "",
            hours: "",
            price: 0,
            tag: "",
            image: "",
            certificateIncluded: false,
            duration: "",
          });
        } else {
          navigate("/InstructorLayout/MyCourses"); //  Redirect after edit
        }
      } else {
        toast.error("Failed to save course.888");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save coursdde.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-lg flex flex-col gap-8">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header={isEdit ? "Edit Course" : "Create New Course"} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Course Title */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-text-secondary font-medium">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Intro to Web Development"
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Programming, Business, Marketing..."
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-text-secondary font-medium">Duration</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="durationNumber"
              value={form.durationNumber || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  durationNumber: e.target.value,
                }))
              }
              placeholder="e.g. 4"
              className="w-1/2 border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
            />

            <select
              name="durationUnit"
              value={form.durationUnit || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  durationUnit: e.target.value,
                }))
              }
              className="w-1/2 border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
            >
              <option value="">Select Unit</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary font-medium">Hours</label>
          <input
            type="text"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            placeholder="e.g. 12 Hours"
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary font-medium">Price ($)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 49.99"
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
          />
        </div>

        {/* Tag */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary font-medium">Tag</label>
          <input
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Beginner, Advanced..."
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
          />
        </div>

        {/* Cover Image */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-text-secondary font-medium">Cover Image</label>

          <input
            accept="image/*"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary bg-surface text-text-primary"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-text-secondary font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write a brief description about the course..."
            className="border border-input p-3 rounded-xl h-32 focus:ring-2 focus:ring-primary bg-surface text-text-primary"
            required
          />
        </div>

        {/* Certificate Included */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            name="certificateIncluded"
            checked={form.certificateIncluded}
            onChange={handleChange}
            className="w-5 h-5 accent-primary"
          />
          <span className="text-text-secondary font-medium">
            Certificate Included
          </span>
        </div>

        {/* Add Lesson Button
        <button
          type="button"
          className="md:col-span-2 border border-primary text-primary rounded-xl py-3 hover:bg-primary/10 transition"
        
          onClick={() => navigate("/InstructorLayout/CreateLesson/" + (id || ""))}
        >
          + Add Lesson
        </button> */}

        {/* Submit Course */}
        <div className="md:col-span-2 flex justify-start">
          <button
            type="submit"
            className={`px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition ${
              saveLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={saveLoading}
          >
            {saveLoading
              ? isEdit
                ? "Updating..."
                : "Submitting..."
              : isEdit
              ? "Update Course"
              : "Submit Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
