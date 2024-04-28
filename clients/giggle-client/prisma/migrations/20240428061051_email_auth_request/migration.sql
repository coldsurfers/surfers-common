-- CreateTable
CREATE TABLE "EmailAuthRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authcode" TEXT NOT NULL,
    "authenticated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailAuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailAuthRequest_email_key" ON "EmailAuthRequest"("email");
