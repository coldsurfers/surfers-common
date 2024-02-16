-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "password" VARCHAR(255),
    "passwordSalt" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAuthRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authcode" TEXT NOT NULL,
    "authenticated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailAuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_authorized" BOOLEAN NOT NULL DEFAULT false,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" TEXT,
    "song_id" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumCover" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "AlbumCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" TEXT,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConcertCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concert" (
    "id" TEXT NOT NULL,
    "artist" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "date" TIMESTAMP(3),
    "html" TEXT,
    "concertCategoryId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertPoster" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConcertPoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertTicket" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "seller" TEXT NOT NULL,
    "sellingURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConcertTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertTicketPrice" (
    "id" TEXT NOT NULL,
    "concertTicketId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConcertTicketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewWave_Profile" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewWave_Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAuthRequest_email_key" ON "EmailAuthRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_account_id_key" ON "Staff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_account_id_key" ON "AuthToken"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_filename_key" ON "Track"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Track_url_key" ON "Track"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Track_song_id_key" ON "Track"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumCover_filename_key" ON "AlbumCover"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumCover_url_key" ON "AlbumCover"("url");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumCover_post_id_key" ON "AlbumCover"("post_id");

-- CreateIndex
CREATE INDEX "Concert_concertCategoryId_idx" ON "Concert"("concertCategoryId");

-- CreateIndex
CREATE INDEX "ConcertPoster_concertId_idx" ON "ConcertPoster"("concertId");

-- CreateIndex
CREATE INDEX "ConcertTicket_concertId_idx" ON "ConcertTicket"("concertId");

-- CreateIndex
CREATE INDEX "ConcertTicketPrice_concertTicketId_idx" ON "ConcertTicketPrice"("concertTicketId");

-- CreateIndex
CREATE UNIQUE INDEX "NewWave_Profile_account_id_key" ON "NewWave_Profile"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "NewWave_Profile_username_key" ON "NewWave_Profile"("username");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumCover" ADD CONSTRAINT "AlbumCover_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concert" ADD CONSTRAINT "Concert_concertCategoryId_fkey" FOREIGN KEY ("concertCategoryId") REFERENCES "ConcertCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertPoster" ADD CONSTRAINT "ConcertPoster_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertTicket" ADD CONSTRAINT "ConcertTicket_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertTicketPrice" ADD CONSTRAINT "ConcertTicketPrice_concertTicketId_fkey" FOREIGN KEY ("concertTicketId") REFERENCES "ConcertTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewWave_Profile" ADD CONSTRAINT "NewWave_Profile_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
