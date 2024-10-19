import express from "express";
import { getAllRequests, viewUserRequest, updateRequestStatus } from "../controllers/admin.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js"; // Assuming admin auth middleware

const router = express.Router();

router.get("/admin/requests", isAuth, getAllRequests);
router.get("/requests/:id", isAuth, viewUserRequest);
router.put("/admin/requests/status", isAuth, updateRequestStatus);

export default router;
