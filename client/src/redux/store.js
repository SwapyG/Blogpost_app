import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import postReducer from "./features/posts/postSlice";
import categoryReducer from "./features/categories/categorySlice";
import tagReducer from "./features/tags/tagSlice";
import commentReducer from "./features/comments/commentSlice";
import uiReducer from "./features/ui/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    categories: categoryReducer,
    tags: tagReducer,
    comments: commentReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
