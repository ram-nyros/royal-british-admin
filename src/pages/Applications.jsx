import { useState, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiX,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} from "../store/adminApiSlice";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: FiClock },
  reviewed: { bg: "bg-blue-100", text: "text-blue-700", icon: FiEye },
  approved: { bg: "bg-green-100", text: "text-green-700", icon: FiCheckCircle },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: FiXCircle },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}
    >
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ApplicationModal({ application, onClose, onStatusChange }) {
  const [updateStatus, { isLoading }] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus({ id: application._id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      onStatusChange?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={application.status} />
            <span className="text-sm text-slate-500">
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Applicant Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Full Name</p>
                <p className="font-medium text-slate-800">{application.name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Course</p>
                <p className="font-medium text-slate-800">
                  {application.course}
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Email</p>
              <p className="font-medium text-slate-800">{application.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Mobile</p>
              <p className="font-medium text-slate-800">{application.mobile}</p>
            </div>
            {application.message && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Message</p>
                <p className="text-slate-700">{application.message}</p>
              </div>
            )}
          </div>

          {/* Status Actions */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {["pending", "reviewed", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isLoading || application.status === status}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    application.status === status
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetApplicationsQuery({
    page,
    limit,
    search: debouncedSearch,
    status,
  });

  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteApplicationMutation();

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
      await deleteApplication(deleteConfirm._id).unwrap();
      toast.success("Application deleted successfully");
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete application");
    }
  }, [deleteConfirm, deleteApplication, refetch]);

  const applications = data?.applications || [];
  const totalPages = data?.totalPages || 1;
  const totalApplications = data?.totalApplications || 0;

  const paginationInfo = useMemo(() => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalApplications);
    return { start, end };
  }, [page, limit, totalApplications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
          <p className="text-slate-500">Manage course applications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
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
                  Applicant
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
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
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <FiFileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No applications found</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {app.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">
                          {app.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{app.course}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-slate-800">{app.email}</p>
                        <p className="text-slate-500">{app.mobile}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(app)}
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
              {totalApplications} applications
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

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={() => {
            refetch();
            setSelectedApplication(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Application
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete the application from{" "}
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
