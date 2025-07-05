-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "characterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "qtJobs" INTEGER NOT NULL,
    "jobs" JSONB NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bonusType" TEXT NOT NULL,
    "equipType" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "equipLvl" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "total_attack" INTEGER DEFAULT 0,
    "attack" INTEGER DEFAULT 0,
    "crit_chance" DOUBLE PRECISION DEFAULT 0,
    "crit_damage" DOUBLE PRECISION DEFAULT 0,
    "sp_attack" INTEGER DEFAULT 0,
    "mp_rec" DOUBLE PRECISION DEFAULT 0,
    "hell_spear_chance" DOUBLE PRECISION DEFAULT 0,
    "hell_spear" INTEGER DEFAULT 0,
    "taint_resistance" DOUBLE PRECISION DEFAULT 0,
    "defense" INTEGER DEFAULT 0,
    "hp" INTEGER DEFAULT 0,
    "crit_resistance" DOUBLE PRECISION DEFAULT 0,
    "sp_def" INTEGER DEFAULT 0,
    "hp_rec" DOUBLE PRECISION DEFAULT 0,
    "counter_attack_resistance" DOUBLE PRECISION DEFAULT 0,
    "exp" INTEGER DEFAULT 0,
    "gp" DOUBLE PRECISION DEFAULT 0,
    "props" JSONB NOT NULL,
    "statusNeck" JSONB,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "equipType" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "effects" JSONB NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stone" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "specialEffect" JSONB,

    CONSTRAINT "Stone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoneData" (
    "id" TEXT NOT NULL,
    "stone" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "StoneData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stone" ADD CONSTRAINT "Stone_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
