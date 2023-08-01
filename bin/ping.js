const dotenv = require("dotenv");
const { get } = require("./lib/request");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

async function run() {
  const url = process.env.PING_URL;

  if (!url) {
    throw new Error("PING_URL not set");
  }

  await get(url);
}

run();
