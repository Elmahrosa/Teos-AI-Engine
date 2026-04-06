import { prisma } from "../prisma/prisma.config";

async function testDb() {
  try {
    await prisma.billingEvent.create({
      data: { 
        provider: "test", 
        externalEventId: "evt_test", 
        status: "test",
        payload: {}  // ← Add required field (adjust based on your schema)
      }
    });
    console.log("✓ Test event created");
  } catch (err) {
    console.error("✗ Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testDb();
