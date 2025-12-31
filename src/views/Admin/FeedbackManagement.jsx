// React
import { useEffect, useState, useMemo } from "react";

// Components
import api from "@/API/Config";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import Pagination from "../Others/Pagination";
import DefaultImage from "../../../public/images/default-avatar.png";
import Urls from "@/API/URL";

const FEEDBACKS_PER_PAGE = 10;
const FeedbacksEndpoint = Urls.GetAllFeedback; // "/Others/get-all-feedbacks"

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    api
      .get(FeedbacksEndpoint)
      .then((res) => {
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        setFeedbacks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Search filter
  const filteredFeedbacks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feedbacks.filter((f) => {
      const email = (f.email || "").toLowerCase();
      const message = (f.message || "").toLowerCase();
      return email.includes(q) || message.includes(q);
    });
  }, [feedbacks, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedbacks.length / FEEDBACKS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * FEEDBACKS_PER_PAGE;
  const pageFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + FEEDBACKS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="p-6">
      <LandingHeading header="Feedback Management" />

      {/* Search */}
      <div className="flex mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or message..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {pageFeedbacks.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No feedback found.
                </td>
              </tr>
            ) : (
              pageFeedbacks.map((fb, idx) => (
                <tr key={fb.id ?? idx} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={fb.feedbackimage || DefaultImage}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{fb.email || "-"}</td>
                  <td className="px-4 py-3">{fb.massage || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {pageFeedbacks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No feedback found.
          </p>
        ) : (
          pageFeedbacks.map((fb, idx) => (
            <div
              key={fb.id ?? idx}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center gap-4"
            >
              <img
                src={fb.feedbackimage || DefaultImage}
                className="w-14 h-14 rounded-full"
              />
              <div>
                <p className="font-semibold">{fb.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                  {fb.massage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default FeedbackManagement;
