import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tagService from "./tagService";

// Get all tags
export const getAllTags = createAsyncThunk(
  "tags/getAllTags",
  async (_, thunkAPI) => {
    try {
      return await tagService.getAllTags();
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

// Create tag (Admin only)
export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tagData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.createTag(tagData, token);
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

// Update tag (Admin only)
export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, tagData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.updateTag(id, tagData, token);
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

// Delete tag (Admin only)
export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tagService.deleteTag(id, token);
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

const initialState = {
  tags: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tags
      .addCase(getAllTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tags = action.payload;
      })
      .addCase(getAllTags.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create tag
      .addCase(createTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update tag
      .addCase(updateTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tags = state.tags.map((tag) =>
          tag._id === action.payload._id ? action.payload : tag
        );
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete tag
      .addCase(deleteTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tags = state.tags.filter((tag) => tag._id !== action.payload.id);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = tagSlice.actions;
export default tagSlice.reducer;
