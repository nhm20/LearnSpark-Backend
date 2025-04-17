import express from "express";
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  getClassNames,
  getSubjects,
  getSimilarUnits,
  searchResults,
} from "../Controllers/unitController.js";

const router = express.Router();

router.post("/", createUnit);
router.get("/", getAllUnits);
router.get("/class-names", getClassNames);
router.get("/subjects", getSubjects);
router.get("/:id", getUnitById);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

router.get("/:id/similar", getSimilarUnits);

router.get("/search/results", searchResults);

export default router;
