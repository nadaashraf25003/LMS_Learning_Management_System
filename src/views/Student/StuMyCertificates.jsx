import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Components
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import useStudent from "@/hooks/useStudent";

// Constants
const COURSES_PER_PAGE = 4;
const CERTIFICATION_PER_PAGE = 4;

function StuMyCertificates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const { getCertificates } = useStudent(); // <-- fetch certificates via hook

  // Fetch student certificates using React Query
  const { data: certificates = [], isLoading: loadingCertificates } =
    getCertificates;
  console.log(certificates);

  // For incomplete courses, assume you have a similar useQuery in your hook
  const { data: incompleteCourses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ["incompleteCourses"],
    queryFn: async () => {
      const res = await fetch("/incompleteCourses"); // Replace with real endpoint
      const data = await res.json();
      return data || [];
    },
    staleTime: 1000 * 60,
  });

  // Pagination for incomplete courses
  const totalPages = Math.max(
    1,
    Math.ceil(incompleteCourses.length / COURSES_PER_PAGE)
  );
  const pageStartIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const pagecourse = incompleteCourses.slice(
    pageStartIndex,
    pageStartIndex + COURSES_PER_PAGE
  );

  // Pagination for certificates
  const totalPages2 = Math.max(
    1,
    Math.ceil(certificates.length / CERTIFICATION_PER_PAGE)
  );
  const pageStartIndex2 = (currentPage2 - 1) * CERTIFICATION_PER_PAGE;
  const pagecertification = certificates.slice(
    pageStartIndex2,
    pageStartIndex2 + CERTIFICATION_PER_PAGE
  );

  // Download certificate as image
  const downloadCertificate = (item) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = "/certificate-template.png";

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      ctx.fillStyle = "#333";
      ctx.textAlign = "center";

      ctx.font = "bold 60px Arial";
      ctx.fillText(
        item.studentName,
        canvas.width / 2,
        canvas.height / 1.5 - 90
      );

      ctx.font = "bold 50px Arial";
      ctx.fillText(
        item.courseName,
        canvas.width / 2,
        canvas.height / 1.5 + 100
      );

      const link = document.createElement("a");
      link.download = `${item.studentName}-certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const loading = loadingCertificates || loadingCourses;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-left">
          <LandingHeading
            header="My Certificates"
            subHeader="Manage and view your certificate achievements"
          />
        </header>

        {/* Incomplete Courses Section */}
        {/* <section className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Continue Your Courses to Unlock New Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pagecourse.map((course) => (
              <div
                key={course.id}
                className={`p-4 rounded-lg border ${
                  course.progressPercent < 50
                    ? "bg-red-50 border-red-100"
                    : course.progressPercent < 80
                    ? "bg-yellow-50 border-yellow-100"
                    : "bg-green-50 border-green-100"
                }`}
              >
                <h3 className="font-medium text-gray-800">{course.title}</h3>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className={`h-2 rounded ${
                      course.progressPercent < 50
                        ? "bg-red-500"
                        : course.progressPercent < 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${course.progressPercent}%` }}
                  ></div>
                </div>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Continue
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section> */}

        {/* Certificates Table */}
        <section className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface">
                  <th className="px-6 py-3">Item No.</th>
                  <th className="px-6 py-3">Course Name</th>
                  <th className="px-6 py-3">Student Name</th>
                  {/* <th className="px-6 py-3">Marks</th> */}
                  {/* <th className="px-6 py-3">Out Of</th> */}
                  <th className="px-6 py-3">Upload Date</th>
                  <th className="px-6 py-3">Certificate</th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-text-secondary"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : pagecertification.length === 0 ? (
                  <tr className="text-center">
                    <td
                      colSpan="7"
                      className="text-center py-4 text-text-secondary"
                    >
                      No certificates found.
                    </td>
                  </tr>
                ) : (
                  pagecertification.map((item, index) => (
                    <tr key={item.id || index} className="text-center">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-text-primary">
                        {item.courseName}
                      </td>
                      <td className="px-6 py-4">{item.studentName}</td>
                      {/* <td className="px-6 py-4">{item.totalMarks}</td> */}
                      <td className="px-6 py-4">
                        {new Date(item.issuedAt).toLocaleDateString()}{" "}
                        {/* Only date */}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => downloadCertificate(item)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-center">
          <Pagination
            currentPage={currentPage2}
            totalPages={totalPages2}
            onPageChange={setCurrentPage2}
          />
        </div>
      </div>
    </div>
  );
}

export default StuMyCertificates;
