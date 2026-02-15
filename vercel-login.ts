import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // First, accept the team invite
  console.log("Step 1: Accepting Vercel team invite...");
  const inviteUrl = "https://vercel.com/invites/J21jOCES5NgD5q2da1CZPSIMsgH3SYddYBUpkHWCKqGuftHz?flow=signup";
  await page.goto(inviteUrl, { waitUntil: "networkidle2", timeout: 30000 });
  
  console.log("Current URL:", page.url());
  console.log("Page title:", await page.title());
  
  // Take screenshot to see what's on the page
  await page.screenshot({ path: "/tmp/vercel-step1.png", fullPage: true });
  console.log("Screenshot saved to /tmp/vercel-step1.png");

  // Check if there's a signup/login form
  const pageContent = await page.content();
  
  // Look for email input
  const emailInput = await page.$('input[type="email"], input[name="email"]');
  if (emailInput) {
    console.log("Found email input, entering email...");
    await emailInput.type("sienna@epiow.com");
    
    // Look for continue/submit button
    const submitBtn = await page.$('button[type="submit"], button:has-text("Continue"), button:has-text("Sign Up")');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});
    }
    
    await page.screenshot({ path: "/tmp/vercel-step2.png", fullPage: true });
    console.log("After email submit - URL:", page.url());
    console.log("Screenshot saved to /tmp/vercel-step2.png");
  } else {
    console.log("No email input found. Page might need different flow.");
    // Log visible text
    const text = await page.evaluate(() => document.body?.innerText?.substring(0, 2000));
    console.log("Page text:", text);
  }

  await browser.close();
}

main().catch(console.error);
