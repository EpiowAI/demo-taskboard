import puppeteer from "puppeteer";

async function checkWebhookForCode(): Promise<string | null> {
  const res = await fetch(
    "https://webhook.site/token/dec75f9f-f412-4bd4-ab1f-ac3186dd3fae/requests?sorting=newest&per_page=5"
  );
  const data = await res.json() as any;
  for (const req of data.data || []) {
    const content = req.content || req.raw_content || "";
    const queryText = JSON.stringify(req.query || {});
    const allText = content + " " + queryText;
    // Look for 6-digit code
    const match = allText.match(/\b(\d{6})\b/);
    if (match) return match[1];
    // Look for "text" field in SMS
    const textMatch = allText.match(/text['":\s]+(\d{4,6})/i);
    if (textMatch) return textMatch[1];
  }
  return null;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      `--load-extension=/usr/local/lib/chromium-stealth-ext`,
      `--disable-extensions-except=/usr/local/lib/chromium-stealth-ext`,
      "--headless=new",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
  );

  // Step 1: Load invite page
  console.log("Step 1: Loading invite page...");
  await page.goto(
    "https://vercel.com/invites/J21jOCES5NgD5q2da1CZPSIMsgH3SYddYBUpkHWCKqGuftHz?flow=signup",
    { waitUntil: "networkidle2", timeout: 30000 }
  );
  console.log("URL:", page.url());
  let text = await page.evaluate(() => document.body?.innerText?.substring(0, 1500));
  console.log("Page:", text?.substring(0, 500));

  // Step 2: Click Continue to accept invite
  console.log("\nStep 2: Clicking Continue...");
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const btnText = await btn.evaluate((el) => el.textContent?.trim());
    if (btnText?.includes("Continue")) {
      await btn.click();
      console.log("Clicked Continue!");
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 5000));
  console.log("URL:", page.url());
  text = await page.evaluate(() => document.body?.innerText?.substring(0, 1500));
  console.log("Page:", text?.substring(0, 500));

  // Step 3: Enter phone number if needed
  if (text?.includes("phone number")) {
    console.log("\nStep 3: Entering phone number...");
    const phoneInput = await page.$('input[type="text"], input[type="tel"]');
    if (phoneInput) {
      await phoneInput.click();
      await phoneInput.type("+447451260998");
      await new Promise((r) => setTimeout(r, 500));

      const btns2 = await page.$$("button");
      for (const btn of btns2) {
        const t = await btn.evaluate((el) => el.textContent?.trim());
        if (t?.includes("Continue")) {
          await btn.click();
          console.log("Submitted phone number!");
          break;
        }
      }

      await new Promise((r) => setTimeout(r, 5000));
      text = await page.evaluate(() => document.body?.innerText?.substring(0, 1500));
      console.log("Page:", text?.substring(0, 500));
    }
  }

  // Step 4: Wait for SMS and enter code
  if (text?.includes("code") || text?.includes("sent to")) {
    console.log("\nStep 4: Waiting for SMS verification code...");

    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      console.log(`  Checking webhook (attempt ${attempt + 1}/12)...`);

      const code = await checkWebhookForCode();
      if (code) {
        console.log(`  Got code: ${code}`);

        const codeInput = await page.$('input[type="text"]');
        if (codeInput) {
          await codeInput.click();
          await codeInput.type(code);
          await new Promise((r) => setTimeout(r, 500));

          // Click Verify
          const btns3 = await page.$$("button");
          for (const btn of btns3) {
            const t = await btn.evaluate((el) => el.textContent?.trim());
            if (t?.includes("Verify")) {
              await btn.click();
              console.log("Clicked Verify!");
              break;
            }
          }

          await new Promise((r) => setTimeout(r, 5000));
          console.log("URL:", page.url());
          text = await page.evaluate(() => document.body?.innerText?.substring(0, 1500));
          console.log("Page:", text?.substring(0, 500));
        }
        break;
      }
    }
  }

  // Check final state
  console.log("\n=== FINAL STATE ===");
  console.log("URL:", page.url());
  text = await page.evaluate(() => document.body?.innerText?.substring(0, 2000));
  console.log("Page:", text);

  // Get cookies for potential Vercel CLI auth
  const cookies = await page.cookies();
  console.log("\nCookies:", cookies.map((c) => `${c.name}=${c.value.substring(0, 20)}...`).join("; "));

  await browser.close();
}

main().catch(console.error);
