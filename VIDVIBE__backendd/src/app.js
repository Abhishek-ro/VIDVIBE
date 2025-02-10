import express from "express"
import cors from "cors"; 
import logger from "./utils/logger.js"; 
import morgan from "morgan";
import "dotenv/config";
const app = express()


const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


app.use(cors({
    // eslint-disable-next-line no-undef
    origin: process.env.CORS,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


import userRoutes from "./routes/user.routes.js" 
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import subscribeRouter from "./routes/subscription.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playListRouter from "./routes/playList.routes.js"
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/subscription", subscribeRouter);
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/playList",playListRouter)
export {app}