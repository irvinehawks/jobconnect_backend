/*
  Warnings:

  - You are about to alter the column `id` on the `Company` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `ownerId` on the `Company` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `companyId` on the `Job` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `Job` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `applicantId` on the `JobApplication` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `JobApplication` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `jobId` on the `JobApplication` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `User` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.

*/
-- DropEnum
DROP TYPE "crdb_internal_region";

-- RedefineTables
CREATE TABLE "_prisma_new_Company" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "ownerId" STRING NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
DROP INDEX "Company_ownerId_key";
INSERT INTO "_prisma_new_Company" ("id","name","ownerId") SELECT "id","name","ownerId" FROM "Company";
DROP TABLE "Company" CASCADE;
ALTER TABLE "_prisma_new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_ownerId_key" ON "Company"("ownerId");
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_Job" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "skills" STRING[] DEFAULT ARRAY[]::STRING[],
    "companyId" STRING NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Job" ("companyId","description","id","skills","title") SELECT "companyId","description","id","skills","title" FROM "Job";
DROP TABLE "Job" CASCADE;
ALTER TABLE "_prisma_new_Job" RENAME TO "Job";
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_JobApplication" (
    "id" STRING NOT NULL,
    "jobId" STRING NOT NULL,
    "applicantId" STRING NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_JobApplication" ("applicantId","createdAt","id","jobId","status") SELECT "applicantId","createdAt","id","jobId","status" FROM "JobApplication";
DROP TABLE "JobApplication" CASCADE;
ALTER TABLE "_prisma_new_JobApplication" RENAME TO "JobApplication";
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_User" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
DROP INDEX "User_email_key";
INSERT INTO "_prisma_new_User" ("createdAt","email","id","password","role","updatedAt") SELECT "createdAt","email","id","password","role","updatedAt" FROM "User";
DROP TABLE "User" CASCADE;
ALTER TABLE "_prisma_new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
