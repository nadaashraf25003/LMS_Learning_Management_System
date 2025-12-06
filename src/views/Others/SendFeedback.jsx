// React
import React, { useState, useRef } from "react";
import { MessageSquare } from "lucide-react";

// Components
import StuStudentLayout from "@/components/StudentLayout/StudentLayout.jsx";
import { Button } from "@/components/ui/button";
import api from "@/API/Config";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";
import Urls from "@/API/URL";

const FEEDBACK_API_URL = Urls.AddFeedBack; // "Others/Add-Feedback"

function SendFeedback() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // رفع الملفات
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setScreenshots((prev) => [...prev, ...filesArray]);
  };

  // فتح نافذة اختيار الملفات
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  // إرسال الفورم
  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Invalid email address", {
        description: "Please enter a valid email before submitting feedback.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Massage", message); // خليها massage مش message
    screenshots.forEach((file) => {
      formData.append("imagefile", file); // ✅ match the property name in FeedBackVM
    });

    console.log("Sending feedback:", formData);
    api
      .post(FEEDBACK_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Feedback sent successfully");
        console.log("✅ Feedback sent successfully:", response.data);
        setEmail("");
        setMessage("");
        setScreenshots([]);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => {
        console.error("Error sending feedback:", error);
        alert("Error sending feedback");
      });
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 flex flex-col lg:flex-row pt-10 px-4 sm:px-8 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-2/3 max-w-lg bg-transparent mx-auto lg:mx-0 px-4 sm:px-8"
      >
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold dark:text-white mb-6">
          {/* <MessageSquare className="w-6 h-6 text-blue-500" /> */}
          <LandingHeading header="Send Feedback" />
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full lg:w-[500px] border rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:text-white dark:bg-zinc-800 dark:text-[#fafafa]"
        />

        <textarea
          placeholder="Describe your issue or share your ideas"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full lg:w-[500px]  border rounded-md p-3 mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:text-white dark:bg-zinc-800 dark:text-[#fafafa]"
        />

        <div>
          <p className="text-gray-600 mb-2 font-medium dark:text-white">
            Add Screenshots
          </p>
          <div
            onClick={handleClickUpload}
            className="flex lg:w-[500px] flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition bg-white mb-6 dark:text-white  dark:bg-zinc-800 text-[#fafafa] dark:hover:bg-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span className="text-gray-600 dark:text-white text-center">
              Select screenshots to upload <br />
              <span className="text-sm text-gray-400 dark:text-gray-200">
                or drag and drop screenshots
              </span>
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {screenshots.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {screenshots.length} file(s) selected
            </p>
          )}
        </div>

        <Button type="submit" className="w-full sm:w-auto mb-4">
          Send Feedback
        </Button>

        {success && (
          <div className="w-full text-center mt-2">
            <p className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-4 py-2 rounded-md">
              ✅ Feedback sent successfully!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default SendFeedback;
