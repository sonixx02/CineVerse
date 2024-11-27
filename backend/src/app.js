import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// // Update CORS to allow multiple origins
// const allowedOrigins = [
//   'https://cine-verse-lilac.vercel.app',  // Vercel frontend
//   'http://localhost:5173',               // Local development frontend
// ];

app.use(
  cors({
    origin: "https://cine-verse-lilac.vercel.app", // Your frontend domain
    credentials: true, // Allow cookies
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
// import other routers if needed

// Routes declaration
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/tweets", tweetRouter);
// app.use("/api/v1/subscriptions", subscriptionRouter);
// app.use("/api/v1/videos", videoRouter);
// app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/likes", likeRouter);
// app.use("/api/v1/playlist", playlistRouter);
// app.use("/api/v1/dashboard", dashboardRouter);

export { app };
