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
  FiDownload,
  FiMaximize2,
} from "react-icons/fi";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../store/adminApiSlice";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Certificate labels
const CERT_LABELS = {
  tenthMarksheet: "10th Marksheet",
  interCertificate: "Inter Certificate",
  degreeCertificate: "Degree Certificate",
};

// Check if file is an image
const isImageFile = (mimeType) => {
  return mimeType?.startsWith("image/");
};

// Certificate Card Component
function CertificateCard({ cert, label, onViewFull }) {
  if (!cert?.dataUrl) {
    return (
      <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
        <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>
        <div className="flex items-center justify-center h-24 text-slate-400">
          <div className="text-center">
            <FiFileText className="w-8 h-8 mx-auto mb-1 opacity-50" />
            <span className="text-xs">Not uploaded</span>
          </div>
        </div>
      </div>
    );
  }

  const isImage = isImageFile(cert.mimeType);

  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>
      {isImage ? (
        <div className="relative group">
          <img
            src={cert.dataUrl}
            alt={label}
            className="w-full h-32 object-cover rounded-lg cursor-pointer"
            onClick={() => onViewFull(cert, label)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
            <button
              onClick={() => onViewFull(cert, label)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-lg"
            >
              <FiMaximize2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-slate-50 rounded-lg">
          <div className="text-center">
            <FiFileText className="w-10 h-10 mx-auto mb-2 text-blue-500" />
            <p className="text-xs text-slate-600 mb-2">
              {cert.originalName || "Document"}
            </p>
            <a
              href={cert.dataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <FiEye className="w-3 h-3" /> View PDF
            </a>
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-end">
        <a
          href={cert.dataUrl}
          download={cert.originalName || label}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
        >
          <FiDownload className="w-3 h-3" /> Download
        </a>
      </div>
    </div>
  );
}

// Image Preview Modal
function ImagePreviewModal({ image, label, onClose }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <h3 className="text-white font-medium">{label}</h3>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>
        </div>
        <img
          src={image.dataUrl}
          alt={label}
          className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/50 to-transparent">
          <a
            href={image.dataUrl}
            download={image.originalName || label}
            className="px-4 py-2 bg-white text-slate-800 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <FiDownload className="w-4 h-4" /> Download
          </a>
        </div>
      </div>
    </div>
  );
}

function UserModal({ user, onClose }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLabel, setPreviewLabel] = useState("");

  if (!user) return null;

  const hasAddress = user.address?.street || user.address?.city;
  const certificates = user.certificates || {};

  const handleViewFull = (cert, label) => {
    setPreviewImage(cert);
    setPreviewLabel(label);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
    setPreviewLabel("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-slate-800">
              User Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              {user.profileImage?.dataUrl ? (
                <img
                  src={user.profileImage.dataUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                  onClick={() =>
                    handleViewFull(user.profileImage, "Profile Image")
                  }
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {user.name}
                </h3>
                <p className="text-slate-500">{user.email}</p>
                {user.is_admin && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhone className="w-5 h-5 text-green-600" />
                </div>
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
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Address
                  </span>
                </div>
                <p className="text-sm text-slate-600 ml-10">
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

            {/* Certificates Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FiFileText className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Educational Certificates
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(CERT_LABELS).map(([certKey, label]) => (
                  <CertificateCard
                    key={certKey}
                    cert={certificates[certKey]}
                    label={label}
                    onViewFull={handleViewFull}
                  />
                ))}
              </div>

              {/* Other Documents */}
              {certificates.otherDocuments?.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Other Documents ({certificates.otherDocuments.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {certificates.otherDocuments.map((doc, idx) => {
                      const isImage = isImageFile(doc.mimeType);
                      return (
                        <div
                          key={idx}
                          className="p-3 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                        >
                          {isImage ? (
                            <img
                              src={doc.dataUrl}
                              alt={doc.originalName || `Document ${idx + 1}`}
                              className="w-full h-20 object-cover rounded cursor-pointer"
                              onClick={() =>
                                handleViewFull(
                                  doc,
                                  doc.originalName || `Document ${idx + 1}`,
                                )
                              }
                            />
                          ) : (
                            <div className="h-20 flex items-center justify-center bg-slate-50 rounded">
                              <FiFileText className="w-8 h-8 text-blue-500" />
                            </div>
                          )}
                          <p className="text-xs text-slate-600 mt-2 truncate">
                            {doc.originalName || `Document ${idx + 1}`}
                          </p>
                          <a
                            href={doc.dataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="pt-4 border-t text-xs text-slate-400 flex justify-between">
              <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(user.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          label={previewLabel}
          onClose={handleClosePreview}
        />
      )}
    </>
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

  const users = data?.users || [];
  const totalUsers = data?.totalUsers || 0;
  const totalPages = data?.totalPages || 1;

  // Debounced search
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUser(deleteConfirm._id).unwrap();
      toast.success("User deleted successfully");
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const paginationInfo = useMemo(() => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalUsers);
    return { start, end };
  }, [page, limit, totalUsers]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Users</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage registered users and their documents
            </p>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Loading users...
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <FiUser className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No users found</p>
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
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
