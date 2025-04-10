import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
  posts: [],
  post: null,
  userPosts: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all posts
export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (params, thunkAPI) => {
    try {
      return await postService.getPosts(params);
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

// Get single post by slug
export const getPostBySlug = createAsyncThunk(
  "posts/getPostBySlug",
  async (slug, thunkAPI) => {
    try {
      return await postService.getPostBySlug(slug);
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

// Get posts by category
export const getPostsByCategory = createAsyncThunk(
  "posts/getPostsByCategory",
  async ({ slug, params }, thunkAPI) => {
    try {
      return await postService.getPostsByCategory(slug, params);
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

// Get posts by tag
export const getPostsByTag = createAsyncThunk(
  "posts/getPostsByTag",
  async ({ slug, params }, thunkAPI) => {
    try {
      return await postService.getPostsByTag(slug, params);
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

// Get posts by author
export const getPostsByAuthor = createAsyncThunk(
  "posts/getPostsByAuthor",
  async ({ userId, params }, thunkAPI) => {
    try {
      return await postService.getPostsByAuthor(userId, params);
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

// Get user posts (dashboard)
export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (params, thunkAPI) => {
    try {
      return await postService.getUserPosts(params);
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

// Create new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      return await postService.createPost(postData);
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

// Update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, thunkAPI) => {
    try {
      return await postService.updatePost(id, postData);
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

// Delete post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, thunkAPI) => {
    try {
      return await postService.deletePost(id);
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

// Search posts
export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (params, thunkAPI) => {
    try {
      return await postService.searchPosts(params);
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

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    resetPost: (state) => {
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all posts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get post by slug
      .addCase(getPostBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload.data;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get posts by category
      .addCase(getPostsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPostsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get posts by tag
      .addCase(getPostsByTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsByTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPostsByTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get posts by author
      .addCase(getPostsByAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsByAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPostsByAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get user posts (dashboard)
      .addCase(getUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPosts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPosts.unshift(action.payload.data);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPosts = state.userPosts.map((post) =>
          post._id === action.payload.data._id ? action.payload.data : post
        );
        if (state.post && state.post._id === action.payload.data._id) {
          state.post = action.payload.data;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPosts = state.userPosts.filter(
          (post) => post._id !== action.payload.id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetPost } = postSlice.actions;
export default postSlice.reducer;
