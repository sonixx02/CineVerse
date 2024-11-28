import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get the API URL from the environment variable
const API_URL = import.meta.env.VITE_API_URL;

export const updateVideo = createAsyncThunk('videos/updateVideo', async ({ videoId, title, description, videoFile }) => {
  try {
    // Update the title and description
    const response = await axios.put(`${API_URL}/${videoId}`, 
      { title, description },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // If a new video file is provided, update it separately
    if (videoFile) {
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      await axios.put(`${API_URL}/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // Fetch the updated video data
    const updatedVideoResponse = await axios.get(`${API_URL}/${videoId}`);
    return updatedVideoResponse.data.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Async thunk to delete video
export const deleteVideo = createAsyncThunk('videos/deleteVideo', async (videoId) => {
  try {
    await axios.delete(`${API_URL}/${videoId}`);
    return videoId; // Return the ID of the deleted video
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Async thunk to fetch random videos
export const RandomVideos = createAsyncThunk('videos/RandomVideos', async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/random`);
    console.log(response);
    return response.data.data; 
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Async thunk to fetch videos by query
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/getVideos?query=${searchTerm}`);
      return response.data.data; // Return the video data
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add a new video
export const addVideo = createAsyncThunk('videos/addVideo', async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/publish`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.message;
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// export const getVideoComments = createAsyncThunk(
//   'videos/getVideoComments',
//   async (videoId) => {
//     try {
//       const response = await axios.get(`${API_URL}/videos/${videoId}/comments?page=1&limit=10`);
//       return response.data.data.comments; 
//     } catch (error) {
//       return Promise.reject(error.response?.data?.message || error.message);
//     }
//   }
// );

export const getVideoComments = createAsyncThunk(
  'videos/getVideoComments',
  async (videoId) => {
    try {
      const response = await axios.get(`${API_URL}/videos/${videoId}/comments?page=1&limit=10`);
      // Transform comments to match the expected structure
      return response.data.data.comments.map(comment => ({
        comment: comment,
        userDetails: comment.owner
      }));
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);



export const addComment = createAsyncThunk(
  'videos/addComment',
  async ({ content, videoId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/videos/${videoId}/comments`, {
        content: content 
      });

      // Directly return the response data structure
      return {
        comment: response.data.data.comment,
        userDetails: response.data.data.comment.owner // Use owner from comment
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



// Async thunk to fetch video by ID
export const fetchVideoById = createAsyncThunk('videos/fetchVideoById', async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/${videoId}`);
    return response.data.data; 
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Async thunk to add to watch history
export const addToWatchHistory = createAsyncThunk('videos/addToWatchHistory', async (videoId) => {
  try {
    const response = await axios.post(`${API_URL}/watch-history`, { videoId });
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Async thunk to fetch watch history
export const fetchWatchHistory = createAsyncThunk('videos/fetchWatchHistory', async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data.data; 
  } catch (error) {
    return Promise.reject(error.response?.data?.message || error.message);
  }
});

// Video slice
const videosSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    watchHistory: [],
    comments: [], 
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RandomVideos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(RandomVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload;
      })
      .addCase(RandomVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload.data;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.videos)) {
          state.videos.push(action.payload);
        }
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchVideoById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = state.videos.filter(video => video._id !== action.payload); // Ensure videos is an array
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedVideo = action.payload;
        const index = state.videos.findIndex(video => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo;
        }
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToWatchHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWatchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.watchHistory.push(action.payload);
      })
      .addCase(addToWatchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchWatchHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.watchHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getVideoComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true; // Set loading state when adding a comment
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        // Directly push the comment object in the expected format
        state.comments.push({
          comment: action.payload.comment,
          userDetails: action.payload.comment.owner
        });
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Capture error
      });
      
  },
});

export default videosSlice.reducer;
