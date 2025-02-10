import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


router.use(verifyJWT);


router
  .route("/:videoId")
  .get(getVideoComments) 
  .post(addComment);


router
  .route("/:commentId")
  .patch(updateComment) 

  router.route("/:commentId")
  .delete(deleteComment); 

export default router;
