import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  await prisma.billingEvent.create({
    data: { provider: "test", externalEventId: "evt_test", status: "test" }
  });
  console.log("✅ DB test passed");
}
test();
