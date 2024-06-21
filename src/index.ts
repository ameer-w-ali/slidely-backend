import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  createSubmission,
  deleteSubmission,
  getAllSubmissionIds,
  getSubmissionById,
  getSubmissionsByEmail,
  updateSubmission,
} from "./controller";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/ping", (req: Request, res: Response) => {
  res.json({ success: true });
});

app.post("/submit", createSubmission);

app.get("/read/:id", getSubmissionById);
app.get("/list", getAllSubmissionIds);
app.get("/submission/:email", getSubmissionsByEmail);
app.delete("/submission/:id", deleteSubmission);
app.put("/submission/:id", updateSubmission);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
