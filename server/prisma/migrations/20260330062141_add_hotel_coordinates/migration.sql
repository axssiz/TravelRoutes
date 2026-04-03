-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "city" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "latitude" REAL NOT NULL DEFAULT 0,
    "longitude" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_hotels" ("city", "createdAt", "description", "id", "imageUrl", "name", "price", "rating", "updatedAt") SELECT "city", "createdAt", "description", "id", "imageUrl", "name", "price", "rating", "updatedAt" FROM "hotels";
DROP TABLE "hotels";
ALTER TABLE "new_hotels" RENAME TO "hotels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
