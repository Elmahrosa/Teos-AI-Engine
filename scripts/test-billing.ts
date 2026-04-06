import { logBillingEvent } from "../lib/db";
logBillingEvent("test", "evt_123", "inv_test").then(() => console.log("✅ Billing test passed")); 
