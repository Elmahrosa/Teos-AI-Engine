import { prisma } from "../lib/prisma";
import { createUser, listUsers } from "../lib/db";

async function main() {
  // Test creating a user
  const newUser = await createUser({
    email: "testuser@example.com",
    plan: "starter",
    status: "trial",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
  });
  console.log("Created user:", newUser);

  // Test listing users
  const users = await listUsers();
  console.log("All users:", users);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
