import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Accept the team invite
  console.log("Step 1: Loading invite page...");
  const inviteUrl = "https://vercel.com/invites/J21jOCES5NgD5q2da1CZPSIMsgH3SYddYBUpkHWCKqGuftHz?flow=signup";
  await page.goto(inviteUrl, { waitUntil: "networkidle2", timeout: 30000 });
  console.log("URL:", page.url());

  // Find and click the Continue button
  console.log("Step 2: Clicking Continue...");
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await btn.evaluate((el) => el.textContent?.trim());
    console.log("Found button:", text);
    if (text?.includes("Continue")) {
      await btn.click();
      console.log("Clicked Continue!");
      break;
    }
  }

  // Wait for navigation or page change
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {
    console.log("No navigation after click");
  });

  console.log("After click URL:", page.url());
  const text = await page.evaluate(() => document.body?.innerText?.substring(0, 3000));
  console.log("Page text:", text);

  await page.screenshot({ path: "/tmp/vercel-step2.png", fullPage: true });

  // Check if we need to verify email
  if (page.url().includes("verify") || text?.includes("verify") || text?.includes("email")) {
    console.log("\n=== NEED EMAIL VERIFICATION ===");
    console.log("Checking email for verification code...");
  }

  // Check if there's an email verification input
  const codeInput = await page.$('input[type="text"], input[name="code"], input[placeholder*="code"]');
  if (codeInput) {
    console.log("Found code input - need to check email for verification code");
  }

  await browser.close();
}

main().catch(console.error);
