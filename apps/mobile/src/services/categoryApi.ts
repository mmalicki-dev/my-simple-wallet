import { api } from "@/redux/api";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
} from "shared";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/category",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
      query: ({ id, body }) => ({ url: `/category/${id}`, method: "PUT", body }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, DeleteCategoryRequest>({
      query: ({ id }) => ({ url: `/category/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
