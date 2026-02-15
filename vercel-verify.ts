import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Go to the invite page with SMS verification token
  console.log("Step 1: Loading SMS verification page...");
  await page.goto(
    "https://vercel.com/invites/J21jOCES5NgD5q2da1CZPSIMsgH3SYddYBUpkHWCKqGuftHz?smsVerificationToken=m3DVZt02RdP4Rk3amErv3qGo",
    { waitUntil: "networkidle2", timeout: 30000 }
  );

  console.log("URL:", page.url());
  const text1 = await page.evaluate(() => document.body?.innerText?.substring(0, 2000));
  console.log("Page text:", text1);

  // Find phone number input
  const phoneInput = await page.$('input[type="tel"], input[name="phone"], input[placeholder*="phone"]');
  if (phoneInput) {
    console.log("\nStep 2: Entering phone number...");
    await phoneInput.click();
    await phoneInput.type("+447451260998");
    
    // Click Continue
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const btnText = await btn.evaluate((el) => el.textContent?.trim());
      if (btnText?.includes("Continue")) {
        await btn.click();
        console.log("Clicked Continue with phone number!");
        break;
      }
    }

    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {
      console.log("(no navigation)");
    });

    // Wait a moment for page to update
    await new Promise(r => setTimeout(r, 3000));

    console.log("After phone submit URL:", page.url());
    const text2 = await page.evaluate(() => document.body?.innerText?.substring(0, 2000));
    console.log("Page text:", text2);
    
    // Check for code input
    const allInputs = await page.$$("input");
    console.log(`Found ${allInputs.length} input(s) on page`);
    for (const inp of allInputs) {
      const type = await inp.evaluate((el) => el.type);
      const name = await inp.evaluate((el) => el.name);
      const ph = await inp.evaluate((el) => el.placeholder);
      console.log(`  Input: type=${type} name=${name} placeholder=${ph}`);
    }
  } else {
    console.log("No phone input found!");
    // List all inputs
    const allInputs = await page.$$("input");
    for (const inp of allInputs) {
      const type = await inp.evaluate((el) => el.type);
      const name = await inp.evaluate((el) => el.name);
      console.log(`  Input: type=${type} name=${name}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
