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

router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

router.use(verifyJWT);


router.route("/:videoId").get(getVideoComments)
router.route("/add/:videoId").post(addComment);

router.route("/:commentId").post(updateComment).delete(deleteComment);
router.route("/:videoId/total").get(getTotalComments);
export default router;
