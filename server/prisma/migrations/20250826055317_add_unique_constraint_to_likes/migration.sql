/*
  Warnings:

  - A unique constraint covering the columns `[likesauthor,authorlikesID]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_likesauthor_authorlikesID_key" ON "public"."likes"("likesauthor", "authorlikesID");
