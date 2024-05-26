-- CreateTable
CREATE TABLE "CookieUsers" (
    "id" TEXT NOT NULL,
    "editingId" TEXT,

    CONSTRAINT "CookieUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "postData" JSONB NOT NULL,
    "cookieId" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CookieUsers_editingId_key" ON "CookieUsers"("editingId");
