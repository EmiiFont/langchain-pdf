/*
  Warnings:

  - The primary key for the `Pdf` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "retriever" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "llm" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "pdfId" TEXT NOT NULL,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversation_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("createAt", "id", "llm", "memory", "pdfId", "retriever", "updatedAt", "userId") SELECT "createAt", "id", "llm", "memory", "pdfId", "retriever", "updatedAt", "userId" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
CREATE TABLE "new_Pdf" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Pdf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pdf" ("content", "createAt", "id", "name", "updatedAt", "userId") SELECT "content", "createAt", "id", "name", "updatedAt", "userId" FROM "Pdf";
DROP TABLE "Pdf";
ALTER TABLE "new_Pdf" RENAME TO "Pdf";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
