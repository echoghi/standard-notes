import puppeteer, { Page } from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';

async function login(page: Page, username: string, password: string) {
  await page.goto('https://example.com/login');
  await page.type('#email', username);
  await page.type('#password', password);
  await page.click('#login-button');
  await page.waitForNavigation();
}

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Perform login action
  await login(page, 'test@test.com', 'password');

  // Now you can go to an authenticated page and run the Lighthouse audit
  const url = 'https://example.com/authenticated-page';
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: new URL(browser.wsEndpoint()).port,
  };

  const runnerResult = await lighthouse(url, options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  console.log(reportHtml);

  await browser.close();
}

runAudit().catch(console.error);
