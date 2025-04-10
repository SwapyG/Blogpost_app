import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  isDarkMode: false,
  searchQuery: "",
  currentPage: 1,
  postsPerPage: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
  filterCategory: "",
  filterTag: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPostsPerPage: (state, action) => {
      state.postsPerPage = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setFilterTag: (state, action) => {
      state.filterTag = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.currentPage = 1;
      state.filterCategory = "";
      state.filterTag = "";
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  setSearchQuery,
  setCurrentPage,
  setPostsPerPage,
  setSortBy,
  setSortOrder,
  setFilterCategory,
  setFilterTag,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
