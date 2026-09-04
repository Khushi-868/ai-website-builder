import { Router } from "express";

import {
  createProject,
  getProject,
  getPublishedProject,
  listProjects,
  deleteProject,
  updateProjectFiles,
  publishProject,
} from "../controllers/projectController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {chat } from "../controllers/ChatController.js"

const projectRouter = Router();

// Public Route
projectRouter.get("/public/:projectId", getPublishedProject);

// Protect all following routes
projectRouter.use(authMiddleware);

// Create project
projectRouter.post("/", createProject);

// Get all projects
projectRouter.get("/", listProjects);

// Get single project
projectRouter.get("/:projectId", getProject);

// Delete project
projectRouter.delete("/:projectId", deleteProject);

// Update project files
projectRouter.put("/:projectId/files", updateProjectFiles);

// Publish project
projectRouter.post("/:projectId/publish", publishProject);

projectRouter.post("/:id/chat",chat)

export default projectRouter;