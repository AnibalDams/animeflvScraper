import puppeteer from 'puppeteer-extra';
import adblocker from "puppeteer-extra-plugin-adblocker"

puppeteer.use(adblocker());
export default async function scrapeIframeLink(link:any) {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the page
  await page.goto(link);

  // Wait for the button to be visible and click it
  await page.waitForSelector('ul.CapiTnv>li[title="SW"]');
  await page.locator('ul.CapiTnv>li[title="SW"]').click()

  
 // await page.click('li[data-original-title="stape"]');
 await page.waitForSelector('iframe');
 let iframeSrc = await page.$eval('iframe', (iframe) => iframe.getAttribute('src'));

 await browser.close();
return iframeSrc
  // Close the browser
}
