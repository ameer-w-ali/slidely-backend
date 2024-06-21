// src/controllers/submissionController.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DB_FILE = path.resolve(__dirname, "../db.json");

interface Submission {
  id: string; // You can generate IDs using uuid or another method
  name: string;
  email: string;
  phoneNumber: string;
  githubLink: string;
  stopwatchTime: string;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export async function createSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      name,
      email,
      phoneNumber,
      githubLink,
      stopwatchTime,
    }: {
      name: string;
      email: string;
      phoneNumber: string;
      githubLink: string;
      stopwatchTime: string;
    } = req.body;

    const newSubmission: Submission = {
      id: generateId(), 
      name,
      email,
      phoneNumber,
      githubLink,
      stopwatchTime,
    };

    const data = fs.readFileSync(DB_FILE, "utf8");
    const submissions: Submission[] = JSON.parse(data);
    submissions.push(newSubmission);

    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

    res.status(201).json({
      message: "Submission created successfully",
      submission: newSubmission,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create submission", error: error.message });
  }
}

export async function getAllSubmissionIds(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Read submissions from JSON file
    const data = fs.readFileSync(DB_FILE, "utf8");
    const submissions: Submission[] = JSON.parse(data);

    // Extract IDs from submissions
    const submissionIds = submissions.map((submission) => submission.id);

    res.status(200).json(submissionIds);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submission IDs",
      error: error.message,
    });
  }
}

export async function getSubmissionById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // Read submissions from JSON file
    const data = fs.readFileSync(DB_FILE, "utf8");
    const submissions: Submission[] = JSON.parse(data);

    // Find the submission by ID
    const submission = submissions.find((s) => s.id === id);

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submission",
      error: error.message,
    });
  }
}

export async function deleteSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // Read submissions from JSON file
    const data = fs.readFileSync(DB_FILE, "utf8");
    let submissions: Submission[] = JSON.parse(data);

    // Filter out the submission with the given ID
    submissions = submissions.filter((submission) => submission.id !== id);

    // Write updated submissions back to JSON file
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete submission",
      error: error.message,
    });
  }
}

export async function updateSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    // Read submissions from JSON file
    const data = fs.readFileSync(DB_FILE, "utf8");
    let submissions: Submission[] = JSON.parse(data);

    // Find the submission by ID and update it
    const index = submissions.findIndex((submission) => submission.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Submission not found" });
    }

    // Update the submission object
    submissions[index] = { ...submissions[index], ...updatedFields };

    // Write updated submissions back to JSON file
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

    res.status(200).json(submissions[index]);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update submission",
      error: error.message,
    });
  }
}

export async function getSubmissionsByEmail(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.params;

    // Read submissions from JSON file
    const data = fs.readFileSync(DB_FILE, "utf8");
    const submissions: Submission[] = JSON.parse(data);

    // Filter submissions by email
    const filteredSubmissions = submissions.filter(
      (submission) => submission.email === email
    );

    res.status(200).json(filteredSubmissions);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submissions by email",
      error: error.message,
    });
  }
}