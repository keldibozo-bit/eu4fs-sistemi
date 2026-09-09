// Skript idempotent i ekzekutuar gjatë build-it (shih package.json → "build")
// që siguron se përdoruesi arkeld@bozolaw.al ka gjithmonë rolin ADMIN në
// sistem, duke e krijuar llogarinë automatikisht nëse nuk ekziston ende.
//
// I sigurt për t'u rifutur në çdo deploy: nuk prek fjalëkalimin e një
// llogarie ekzistuese, thjesht i jep rolin ADMIN nëse i mungon.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "arkeld@bozolaw.al";
const ADMIN_NAME = "Arkeld Bozo";
const TEMP_PASSWORD = "EU4FS-Admin-2026!";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (!existing) {
    const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 10);
    await prisma.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`[bootstrap-admin] U krijua llogaria admin për ${ADMIN_EMAIL}.`);
  } else if (existing.role !== "ADMIN") {
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: "ADMIN" },
    });
    console.log(`[bootstrap-admin] U ngrit në rol ADMIN përdoruesi ekzistues ${ADMIN_EMAIL}.`);
  } else {
    console.log(`[bootstrap-admin] ${ADMIN_EMAIL} është tashmë ADMIN — asgjë për të bërë.`);
  }
}

main()
  .catch((err) => {
    // Nuk duam që një dështim këtu të prishë gjithë build-in e aplikacionit.
    console.error("[bootstrap-admin] Paralajmërim — dështoi, po vazhdohet build-i:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
