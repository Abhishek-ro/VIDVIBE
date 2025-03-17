import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  getTotalComments,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Protect all routes with JWT authentication
router.use(verifyJWT);

// Routes for comments based on video ID
router.route("/:videoId").get(getVideoComments)
router.route("/:videoId").post(addComment);
// Routes for updating and deleting a specific comment
router.route("/:commentId").post(updateComment).delete(deleteComment);
router.route("/:videoId/total").get(getTotalComments);
export default router;
