import { rootApiSlice } from "./rootApiSlice";

export const adminApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Auth endpoints
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/api/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => "/api/admin/me",
      providesTags: ["User"],
    }),

    // Dashboard
    getDashboardStats: builder.query({
      query: () => "/api/admin/dashboard",
      transformResponse: (response) => ({
        totalUsers: response.stats?.totalUsers || 0,
        totalApplications: response.stats?.totalApplications || 0,
        pendingApplications: response.stats?.pendingApplications || 0,
        approvedApplications: response.stats?.approvedApplications || 0,
        recentApplications: response.recentApplications || [],
        recentUsers: response.recentUsers || [],
      }),
      providesTags: ["Dashboard"],
    }),

    // Users endpoints
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/api/admin/users?page=${page}&limit=${limit}&search=${search}`,
      transformResponse: (response) => ({
        users: response.users || [],
        totalUsers: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => `/api/admin/users/${id}`,
      transformResponse: (response) => response.user,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Dashboard"],
    }),

    // Applications endpoints
    getApplications: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "all" }) =>
        `/api/admin/applications?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      transformResponse: (response) => ({
        applications: response.applications || [],
        totalApplications: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: ["Applications"],
    }),
    getApplicationById: builder.query({
      query: (id) => `/api/admin/applications/${id}`,
      transformResponse: (response) => response.application,
      providesTags: (result, error, id) => [{ type: "Applications", id }],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Dashboard"],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/api/admin/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Applications", "Dashboard"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetMeQuery,
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} = adminApiSlice;
