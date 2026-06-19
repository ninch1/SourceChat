import { asyncWrapper } from "../utils/asyncWrapper.js";
import ErrorResponse from "../middleware/errorResponse.js";

export const createDocument = asyncWrapper(async (req, res) => {
  const { title, text } = req.body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    throw new ErrorResponse("Title is required", 400);
  }

  if (typeof text !== "string" || text.trim() === "") {
    throw new ErrorResponse("Text is required", 400);
  }

  res.status(201).json({
    message: "Document received successfully",
    document: {
      title: title.trim(),
      text: text.trim(),
    },
  });
});
