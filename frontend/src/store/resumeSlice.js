import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: { resumeText: "", analysis: null, isLoading: false, error: null },
  reducers: {
    uploadResume: (state, action) => { state.resumeText = action.payload; },
    setAnalysis: (state, action) => { state.analysis = action.payload; state.isLoading = false; },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { uploadResume, setAnalysis, setLoading, setError } = resumeSlice.actions;
export default resumeSlice.reducer;  // Ensure this is the default export
