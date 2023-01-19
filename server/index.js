import express from "express"; // backend library
import bodyParser from "body-parser"; // process request body
import mongoose, { mongo } from "mongoose"; // MongoDB access
import cors from "cors"; // cross origin requests
import dotenv from "dotenv"; // environment variables
import multer from "multer"; // upload files locally
import helmet from "helmet"; // request safety
import morgan from "morgan"; // logging
import path from "path"; // to set paths
import { fileURLToPath } from "url"; // to set paths
import authRoutes from "./routes/auth";
import { register } from "./controllers/auth.js"; // controller endpoints

/* CONFIGURATIONS - Middleware and package configs */
const __filename = fileURLToPath(import.meta.url); // to grab file URL
const __dirname = path.dirname(__filename); // to use directory name
dotenv.config(); // use dotenv files
const app = express(); // invoke express to use middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // directory of assets - images stored locally

/* FILE STORAGE - To save files using multer */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); // variable when uploading files

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // use a middleware to upload picture locally

/* ROUTES - setup routes and keep files organised*/
app.use("/auth", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // backup port
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
