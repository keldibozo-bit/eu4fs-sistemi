import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Duke perditesuar user-in pm1@example.com -> Artan Bozo...");
    const updated = await prisma.user.updateMany({
          where: { email: "pm1@example.com" },
          data: {
                  name: "Artan Bozo",
                  email: "artan@bozolaw.al",
          },
    });
    console.log(`U perditesuan ${updated.count} rreshta.`);
}

main()
  .catch((e) => {
        console.error(e);
        process.exit(1);
  })
  .finally(async () => {
        await prisma.$disconnect();
  });
