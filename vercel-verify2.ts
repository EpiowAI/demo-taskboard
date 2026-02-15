import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  console.log("Loading SMS verification page...");
  await page.goto(
    "https://vercel.com/invites/J21jOCES5NgD5q2da1CZPSIMsgH3SYddYBUpkHWCKqGuftHz?smsVerificationToken=m3DVZt02RdP4Rk3amErv3qGo",
    { waitUntil: "networkidle2", timeout: 30000 }
  );

  // There's a text input - it's likely the phone input
  const textInput = await page.$('input[type="text"]');
  if (textInput) {
    console.log("Found text input, entering phone number...");
    await textInput.click();
    await textInput.type("+447451260998");
    
    // Small delay then click Continue
    await new Promise(r => setTimeout(r, 500));
    
    // Try clicking the button
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const btnText = await btn.evaluate((el) => el.textContent?.trim());
      console.log("Button:", btnText);
      if (btnText?.includes("Continue")) {
        await btn.click();
        console.log("Clicked Continue!");
        break;
      }
    }

    // Wait for page to process
    await new Promise(r => setTimeout(r, 5000));

    console.log("URL:", page.url());
    const text = await page.evaluate(() => document.body?.innerText?.substring(0, 2000));
    console.log("Page text:", text);

    // Check for OTP/code input
    const inputs = await page.$$("input");
    console.log(`\nFound ${inputs.length} input(s):`);
    for (const inp of inputs) {
      const attrs = await inp.evaluate((el) => ({
        type: el.type,
        name: el.name,
        placeholder: el.placeholder,
        value: el.value,
        id: el.id,
      }));
      console.log("  ", JSON.stringify(attrs));
    }
  }

  await browser.close();
}

main().catch(console.error);
