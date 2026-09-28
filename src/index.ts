import "dotenv/config";
import { runRefundAgent } from "./refundAgent.js";

const testMessages = [
  // "Hi, can I get a refund? My email is pratham1pancholi@gmail.com",
  // "Can I get a refund? My email is john.doe@example.com",
  // "Can I get a refund please?",
  "Can I get a refund? My email is unknown@example.com",
];

async function main() {
  for (const message of testMessages) {
    const decision = await runRefundAgent(message);
    console.log("User:", message);
    console.log("Agent:", JSON.stringify(decision, null, 2));
    console.log("---");
  }
}

main();
