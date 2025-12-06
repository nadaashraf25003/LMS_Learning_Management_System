// React
import { useEffect, useMemo, useState } from "react";

// Components
import api from "@/API/Config";
import Pagination from "../Others/Pagination";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import toast, { Toaster } from "react-hot-toast";
import ConfirmToast from "@/utils/ConfirmToast";
import DefaultImage from "../../../public/images/default-avatar.png";
import useTokenStore from "@/store/user";
import Urls from "@/API/URL";

// Endpoints and constants
const USERS_PER_PAGE = 10;
const UsersEndPoint = Urls.Users; // "Admin/get-all-users"
const DeleteUsersEndPoint = Urls.DeleteUser; // "Admin/delete-user-by"
const UpdateUsersEndPoint = Urls.UpdateUser; // "Admin/update-user-by"
const ApproveUserEndPoint = Urls.ApproveUser; // "Admin/approve-user-by"
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // View Modal state
  const [selectedUser, setSelectedUser] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | student | instructor | admin
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useTokenStore.getState();
  // const Image = user?.image || DefaultImage;

  console.log(user.profileImage);
  useEffect(() => {
    setLoading(true);
    api
      .get(UsersEndPoint)
      .then((res) => {
        // assume res.data is an array of user objects
        setUsers(Array.isArray(res.data.users) ? res.data.users : res.data);
        console.log("Fetched users:", users);
        console.log("Fetched users:", res.data.users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Reset to page 1 when search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // Filtered users according to search and role filter (instant)
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      // role filter
      if (roleFilter !== "all" && (u.role || "").toLowerCase() !== roleFilter) {
        return false;
      }

      // search across name, email, role, phone
      if (!q) return true;
      const name = (u.name || u.fullName || "").toString().toLowerCase();
      const email = (u.email || "").toString().toLowerCase();
      const role = (u.role || "").toString().toLowerCase();
      const phone = (u.phone || "").toString().toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        role.includes(q) ||
        phone.includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  );
  const pageStartIndex = (currentPage - 1) * USERS_PER_PAGE;
  const pageUsers = filteredUsers.slice(
    pageStartIndex,
    pageStartIndex + USERS_PER_PAGE
  );

  // Placeholder action handlers
  const handleView = (user) => {
    setSelectedUser(user);
    console.log("View user", user);
  };

  const closeModal = () => setSelectedUser(null);
  const handleApprove = (user) => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Approve ${user.fullName}'s account?`}
        onConfirm={() => {
          api
            .put(`${ApproveUserEndPoint}/${user.id}`)
            .then(() => {
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === user.id ? { ...u, isApproved: true } : u
                )
              );
              toast.success(`${user.fullName} has been approved`);
            })
            .catch(() => {
              toast.error("Failed to approve user. Try again.");
            });
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };

  const handleDelete = (user) => {
    toast.custom((t) => (
      <ConfirmToast
        message={`Are you sure you want to delete ${user.fullName}?`}
        onConfirm={() => {
          api
            .delete(`${DeleteUsersEndPoint}/${user.id}`)
            .then(() => {
              setUsers((prev) => prev.filter((u) => u.id !== user.id));
              toast.success(`Deleted ${user.fullName}`);
            })
            .catch(() => {
              toast.error("Failed to delete user. Try again.");
            });
        }}
        onCancel={() => {
          toast.dismiss(t.id); // optional, already handled in ConfirmToast
        }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <LandingHeading header="User Management" />

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role or phone..."
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Filter by role:
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              {/* <th className="px-4 py-2 text-left">Phone</th> */}
              <th className="px-4 py-2 text-left">Enrollment Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              pageUsers.map((user, idx) => (
                <tr
                  key={user.id ?? idx}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <img
                      src={
                        user.profileImage
                          ? `${import.meta.env.VITE_BASE_URL}${
                              user.profileImage
                            }` // Vite
                          : DefaultImage
                      }
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{user.fullName || "-"}</td>
                  <td className="px-4 py-3">{user.email || "-"}</td>
                  <td className="px-4 py-3 capitalize">{user.role || "-"}</td>
                  {/* <td className="px-4 py-3">{user.phone || "-"}</td> */}
                  <td className="px-4 py-3">
                    {user.createdAt
                      ? new Date(user.createdAt).toISOString().split("T")[0]
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-600 cursor-pointer "
                      onClick={() => handleView(user)}
                    >
                      View
                    </button>
                    <button
                      className={`px-2 py-1 text-xs rounded-md text-white ${
                        user.isApproved
                          ? "bg-green-600 cursor-default"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                      onClick={() => !user.isApproved && handleApprove(user)}
                      disabled={user.isApproved}
                    >
                      {user.isApproved ? "Approved" : "Approve"}
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-secondary text-white rounded-md hover:bg-red-600 cursor-pointer"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {pageUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        ) : (
          pageUsers.map((user, idx) => (
            <div
              key={user.id ?? idx}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={Image}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.name || "-"}</p>
                  <p className="text-xs text-gray-500">{user.email || "-"}</p>
                  <p className="text-xs capitalize">{user.role || "-"}</p>
                  <p className="text-xs text-gray-500">
                    {user.EnrollDate || "-"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="px-2 py-1 text-xs bg-primary text-white rounded-md cursor-pointer"
                  onClick={() => handleView(user)}
                >
                  View
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md text-white ${
                    user.isApproved
                      ? "bg-green-600 cursor-default"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                  onClick={() => !user.isApproved && handleApprove(user)}
                  disabled={user.isApproved}
                >
                  {user.isApproved ? "Approved" : "Approve"}
                </button>
                <button
                  className="px-2 py-1 text-xs bg-secondary text-white rounded-md cursor-pointer"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* View User Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up"
          onClick={closeModal}
        >
          <div
            className="bg-surface dark:bg-card rounded-lg shadow-lg w-[400px] max-w-[90vw] p-6 relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 rounded-full hover:bg-muted/50"
              onClick={closeModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header with Avatar */}
            <div className="text-center mb-6">
              <img
                src={Image}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-border"
                alt={selectedUser.fullName}
              />
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                {selectedUser.fullName}
              </h2>
              <p className="text-primary text-sm capitalize">
                {selectedUser.role}
              </p>
            </div>

            {/* User Details */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-text-secondary">Email:</span>
                <span className="text-text-primary">
                  {selectedUser.email || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-text-secondary">Phone:</span>
                <span className="text-text-primary">
                  {selectedUser.phone || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-text-secondary">Joined:</span>
                <span className="text-text-primary">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>

              <div className="py-2">
                <span className="font-medium text-text-secondary block mb-2">
                  About:
                </span>
                <p className="text-text-primary text-sm leading-relaxed">
                  {selectedUser.about || "No description available."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 border border-border"
                onClick={closeModal}
              >
                Close
              </button>

              <button
                className={`px-4 py-2 text-sm rounded-md text-primary-foreground transition-all duration-300 ${
                  selectedUser.isApproved
                    ? "bg-green-600 cursor-default shadow-md"
                    : "bg-secondary hover:bg-secondary/90 shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                }`}
                onClick={() => {
                  !selectedUser.isApproved && handleApprove(selectedUser);
                  closeModal();
                }}
                disabled={selectedUser.isApproved}
              >
                {selectedUser.isApproved ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approved
                  </span>
                ) : (
                  "Approve User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default UserManagement;
