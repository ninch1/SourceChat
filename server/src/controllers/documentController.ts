import { Request, Response } from "express";

export const createDocument = async (req: Request, res: Response) => {
  const { title, text } = req.body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  if (typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ message: "Text is required" });
  }

  console.log({ title, text });

  return res.status(201).json({
    message: "Document received successfully",
    document: {
      title: title.trim(),
      text: text.trim(),
    },
  });
};
