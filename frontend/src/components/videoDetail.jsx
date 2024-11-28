import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchVideoById, getVideoComments, addComment } from "../redux/videosSlice";

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const video = useSelector((state) => state.videos.selectedVideo);
  const comments = useSelector((state) => state.videos.comments);
  const status = useSelector((state) => state.videos.status); 
  const commentStatus = useSelector((state) => state.videos.commentStatus);
  const error = useSelector((state) => state.videos.error);
  const commentError = useSelector((state) => state.videos.commentError); 

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId)); 
      dispatch(getVideoComments(videoId)); 
      // Removed incorrect addComment call
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    console.log("Comments from state:", comments);
  }, [comments]);
  

  const handleAddComment = (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (commentText.trim() && videoId) {
      dispatch(addComment({ 
        content: commentText.trim(), 
        videoId: videoId 
      }))
      .unwrap()
      .then((result) => {
        // Clear input field
        setCommentText('');
        // Optionally refresh comments
        dispatch(getVideoComments(videoId));
      })
      .catch((error) => {
        // Handle error (show error message)
        console.error('Failed to add comment:', error);
      });
    }
  };

 
  if (status === "loading" || commentStatus === "loading") {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  
  if (status === "failed" || commentStatus === "failed") {
    return <div className="text-center text-lg font-semibold">Error: {error || commentError}</div>;
  }

  
  if (!video) {
    return <div className="text-center text-lg font-semibold">Video not found</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <video src={video.videoFile} controls className="w-full mb-4"></video>
      <p className="text-gray-700 mb-6">{video.description}</p>

      
      <div className="border-t pt-4">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

       
        {comments.map((commentItem, index) => {
  const { comment } = commentItem || {};
  if (!comment) return null; // Safeguard for missing data

  const { likes ,owner, content, updatedAt } = comment;
  const avatar = owner?.avatar || "/default-avatar.png";
  const username = owner?.username || "Anonymous";

  return (
    <div key={comment._id || index} className="mb-4">
      <div className="flex items-center mb-2">
        <img
          src={comment.userDetails.avatar}
          alt={`${username}'s avatar`}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{comment.userDetails.username}</span>
        
        <p className="font-semibold ml-2">{likes} Likes</p>
      </div>
      <p>{content || "No content available"}</p>
      <div className="text-sm text-gray-500">
        {updatedAt ? new Date(updatedAt).toLocaleString() : "Date unavailable"}
      </div>
    </div>
  );
})}


       
<div className="mt-6">
        <form onSubmit={handleAddComment} className="flex flex-col space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="border rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={!commentText.trim()}
          >
            {commentStatus === "loading" ? "Posting..." : "Add Comment"}
          </button>
        </form>
      </div>

       
        {commentStatus === "failed" && commentError && (
          <div className="text-red-500 text-sm mt-2">{commentError}</div>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;
