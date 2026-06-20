import { asyncWrapper } from "../utils/asyncWrapper.js";
import ErrorResponse from "../errors/errorResponse.js";
import { createDocumentFromText } from "../services/documentService.js";

export const createDocument = asyncWrapper(async (req, res) => {
  const { title, text } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    throw new ErrorResponse("Title is required", 400);
  }

  if (typeof text !== "string" || text.trim() === "") {
    throw new ErrorResponse("Text is required", 400);
  }

  const document = await createDocumentFromText(title, text);
  res.status(201).json({ message: "Document created successfully", document });
});

export const uploadDocumentFile = asyncWrapper(async (req, res) => {
  const file = req.file;
  let title = req.body.title;

  if (!file) {
    throw new ErrorResponse("File is required", 400);
  }

  if (file.mimetype !== "text/plain") {
    throw new ErrorResponse("Only .txt files are supported", 400);
  }

  const text = file.buffer.toString("utf-8");

  if (!title) {
    title = file.originalname.split(".")[0];
  }

  if (typeof title !== "string" || title.trim() === "") {
    throw new ErrorResponse("Title is required", 400);
  }

  if (typeof text !== "string" || text.trim() === "") {
    throw new ErrorResponse("Text is required", 400);
  }

  const document = await createDocumentFromText(title, text);

  res.status(201).json({
    message: "Document received successfully",
    document,
  });
});
