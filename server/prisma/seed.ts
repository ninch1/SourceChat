import { prisma } from "../src/lib/prisma.js";
import { chunks } from "../src/data/chunks.js";

async function seed() {
  console.log("Seeding database...");

  // Delete existing documents.
  // Related chunks are deleted automatically because of onDelete: Cascade.
  await prisma.document.deleteMany();

  // Create one test document that all sample chunks belong to.
  const document = await prisma.document.create({
    data: {
      title: "Sample Knowledge Base",
    },
  });

  // Insert sample chunks and connect each one to the document.
  for (const chunk of chunks) {
    await prisma.chunk.create({
      data: {
        documentId: document.id,
        text: chunk.text,
        keywords: chunk.keywords,
      },
    });
  }

  console.log("Database seeded successfully");
}

seed()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
