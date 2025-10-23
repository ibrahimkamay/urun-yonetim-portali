-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_ownerId_idx" ON "public"."Product"("ownerId");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "public"."Product"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
