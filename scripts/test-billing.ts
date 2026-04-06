import { logBillingEvent } from "../lib/db.js";

logBillingEvent("stripe", "evt_test_123", "inv_test123")
  .then(() => console.log("✅ Billing test PASSED"))
  .catch(console.error);
