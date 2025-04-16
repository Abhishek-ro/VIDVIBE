# VidVibe - Share Your Moments, Discover New Vibes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Maintenance](https://img.shields.io/badge/Maintained-yes-green.svg)
![Built With](https://img.shields.io/badge/Built%20With-MERN%20Stack-blueviolet)
![Visit VidVibe](https://img.shields.io/badge/Visit%20VidVibe-Live-brightgreen)

**Welcome to VidVibe!** It's a platform I've built to make sharing and discovering videos a breeze. Whether you're uploading your latest creations or exploring content from others, VidVibe offers a seamless and engaging experience.

**Check out the live project here: [https://vidvibe-xtmh.vercel.app](https://vidvibe-xtmh.vercel.app)**

## What is VidVibe?

VidVibe is a video sharing platform crafted with the MERN (MongoDB, Express.js, React.js, Node.js) stack. My aim was to create an intuitive space where users can effortlessly upload their videos and connect with a community that appreciates diverse content. Think of it as your go-to place to share your stories, showcase your talents, or simply share captivating videos you've found.

## Key Features

- **Seamless Video Uploads:** Sharing your content is quick and easy with an intuitive upload process.
- **Immersive Playback:** Enjoy smooth and responsive video streaming for an uninterrupted viewing experience.
- **Effortless Discovery:** Find new and exciting videos with robust search functionality, currently supporting title-based searches with more options planned.
- **Express Your Appreciation:** Show your support for creators with a simple like!
- **Engage in Conversations:** Connect with other viewers by leaving and responding to comments, building a vibrant community.
- **Personalized Profiles:** Each user has a dedicated profile showcasing their uploaded videos.
- **Stay Connected with Subscriptions:** Follow your favorite creators and never miss their latest uploads by subscribing to their channels.
- **Cross-Device Compatibility:** VidVibe's responsive design ensures a consistent and enjoyable experience across desktops, tablets, and mobile devices.
- **Comprehensive Backend API:** The platform is powered by a well-structured backend featuring numerous API endpoints. These endpoints handle functionalities such as user registration and login, video uploads, fetching and managing video lists, handling likes and comments, managing subscriptions, and much more, ensuring scalability and maintainability.

## Behind the Scenes - Technologies Used

VidVibe is powered by the following technologies:

**Backend:**

- **Node.js:** The JavaScript runtime environment for server-side execution.
- **Express.js:** A minimalist and flexible Node.js web application framework for building robust APIs.
- **MongoDB:** A scalable and flexible NoSQL database for storing application data.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JSON Web Tokens (JWT):** For secure authentication and authorization.
- **bcrypt:** For securely hashing user passwords.
- **cookie-parser:** Middleware to parse HTTP request cookies.
- **cors:** Middleware to enable Cross-Origin Resource Sharing.
- **dotenv:** To manage environment variables securely.
- **morgan:** HTTP request logger middleware for debugging and monitoring.
- **multer:** Middleware for handling `multipart/form-data`, primarily for video file uploads.
- **nodemailer:** For potential future email-based features like password recovery and notifications.
- **winston:** A versatile logging library for tracking application events and errors.
- **mongoose-aggregate-paginate-v2:** For efficient pagination of large video lists using MongoDB aggregation.
- **Cloudinary:** A cloud-based media management platform for storing, optimizing, and delivering videos and thumbnails.

**Frontend:**

- **React.js:** A declarative and component-based JavaScript library for building dynamic user interfaces.
- **Vite:** A fast and modern build tool that provides a rapid development experience.
- **Axios:** A promise-based HTTP client for making API requests to the backend.
- **React Router DOM:** For declarative routing and navigation within the single-page application.
- **Redux (with React-Redux):** A predictable state management library for complex React applications.
- **@tanstack/react-query:** A powerful library for fetching, caching, synchronizing, and updating asynchronous data in React.
- **tailwindcss:** A utility-first CSS framework for rapid UI development with consistent styling.
- **@tailwindcss/vite:** Plugin for integrating Tailwind CSS seamlessly with Vite.
- **Cloudinary:** Client-side SDK for interacting with Cloudinary's media management services.
- **date-fns:** A modern JavaScript date utility library for handling date and time operations.
- **notistack:** A library for displaying simple and elegant snackbar notifications.

## Getting Started Locally (For Developers)

Want to run VidVibe on your local machine? Here's how:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Abhishek-ro/VIDVIBE
    cd VIDVIBE
    ```

2.  **Navigate to the backend directory and install dependencies:**
    ```bash
    cd VIDVIBE__backendd
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file in the `VIDVIBE__backendd` directory** (if one doesn't exist) and configure your environment variables. Refer to your `.env.example` file for the necessary variables. **Do not hardcode sensitive information directly into this file in a public repository.** Here are some key variables you might need to set (refer to `.env.example` if available):
    ```env
    PORT=YOUR_BACKEND_PORT
    CONNECTDATABASE=YOUR_MONGODB_CONNECTION_STRING
    CORS_ORIGIN=YOUR_CORS_ORIGIN
    ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRY=YOUR_ACCESS_TOKEN_EXPIRY
    REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRY=YOUR_REFRESH_TOKEN_EXPIRY
    NODE_ENV=YOUR_NODE_ENVIRONMENT
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
    ```
    **Important:** Store your actual, sensitive credentials securely and consider using environment variables or a secrets management system, especially for production deployments.

4.  **Navigate to the frontend directory and install dependencies:**
    ```bash
    cd ../VIDVIBE__FRONTENDD
    npm install
    # or
    yarn install
    ```

5.  **Create a `.env.local` file in the `VIDVIBE__FRONTENDD` directory** (if one doesn't exist) and set the following environment variables (refer to `.env.example` if available):
    ```env
    VITE_BACKEND_URL=YOUR_BACKEND_URL
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
    ```
    **Important:** Store your actual API keys and secrets securely.

6.  **Run the backend development server:**
    ```bash
    cd ../VIDVIBE__backendd
    npm run dev
    # or
    yarn dev
    ```

7.  **Run the frontend development server:**
    ```bash
    cd ../VIDVIBE__FRONTENDD
    npm run dev
    # or
    yarn dev
    ```

    The frontend will typically be accessible at `http://localhost:5173`.

## Contributing

I welcome contributions and ideas to make VidVibe even better! If you're interested in contributing:

1.  Fork the repository on GitHub.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-contribution`).
3.  Make your changes and commit them with a clear and descriptive message (`git commit -m 'Implement new feature or fix bug'`).
4.  Push your changes to your forked repository (`git push origin feature/your-contribution`).
5.  Submit a pull request to the master repository on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## Let's Connect!

I'd love to hear your feedback and see what you share on VidVibe!

- Gmail - abhishekkumarmk142004@gmail.com
- LinkedIn - https://www.linkedin.com/in/abhishekkumar0605/


Thank you for exploring VidVibe! I hope you find it a great place to share and discover videos.
