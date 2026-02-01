import { useState, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../store/adminApiSlice";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function UserModal({ user, onClose }) {
  if (!user) return null;

  const hasAddress = user.address?.street || user.address?.city;
  const certificates = user.certificates || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            {user.profileImage?.dataUrl ? (
              <img
                src={user.profileImage.dataUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {user.name}
              </h3>
              <p className="text-slate-500">{user.email}</p>
              {user.is_admin && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <FiMail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-800">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <FiPhone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-800">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          {hasAddress && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Address
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {[
                  user.address?.street,
                  user.address?.city,
                  user.address?.state,
                  user.address?.zipCode,
                  user.address?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}

          {/* Certificates */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiFileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Certificates
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["tenthMarksheet", "interCertificate", "degreeCertificate"].map(
                (certKey) => {
                  const cert = certificates[certKey];
                  const labels = {
                    tenthMarksheet: "10th Marksheet",
                    interCertificate: "Inter Certificate",
                    degreeCertificate: "Degree Certificate",
                  };
                  return (
                    <div key={certKey} className="p-3 border rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        {labels[certKey]}
                      </p>
                      {cert?.dataUrl ? (
                        <a
                          href={cert.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not uploaded
                        </span>
                      )}
                    </div>
                  );
                },
              )}
            </div>
            {certificates.otherDocuments?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">Other Documents</p>
                <div className="flex flex-wrap gap-2">
                  {certificates.otherDocuments.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {doc.originalName || `Document ${idx + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t text-xs text-slate-400">
            <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);

    const timeoutId = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUser(deleteConfirm._id).unwrap();
      toast.success("User deleted successfully");
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  }, [deleteConfirm, deleteUser, refetch]);

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.totalUsers || 0;

  const paginationInfo = useMemo(() => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalUsers);
    return { start, end };
  }, [page, limit, totalUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500">Manage registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <FiUser className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage?.dataUrl ? (
                          <img
                            src={user.profileImage.dataUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_admin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Showing {paginationInfo.start} to {paginationInfo.end} of{" "}
              {totalUsers} users
            </span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete User
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteConfirm.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
