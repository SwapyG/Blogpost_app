import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

const initialState = {
  categories: [],
  featuredCategories: [],
  category: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all categories
export const getCategories = createAsyncThunk(
  "categories/getAll",
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategories();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get featured categories
export const getFeaturedCategories = createAsyncThunk(
  "categories/getFeatured",
  async (_, thunkAPI) => {
    try {
      return await categoryService.getFeaturedCategories();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get category by slug
export const getCategoryBySlug = createAsyncThunk(
  "categories/getBySlug",
  async (slug, thunkAPI) => {
    try {
      return await categoryService.getCategoryBySlug(slug);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new category (admin only)
export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update category (admin only)
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, categoryData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete category (admin only)
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      return await categoryService.deleteCategory(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    resetCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get featured categories
      .addCase(getFeaturedCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredCategories = action.payload;
      })
      .addCase(getFeaturedCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get category by slug
      .addCase(getCategoryBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = action.payload;
      })
      .addCase(getCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
        if (state.category && state.category._id === action.payload._id) {
          state.category = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetCategory } = categorySlice.actions;
export default categorySlice.reducer;
