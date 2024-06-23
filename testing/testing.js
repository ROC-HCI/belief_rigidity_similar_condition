const puppeteer = require("puppeteer");
const testCases = require("./testingSets");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const pages = [];

  const numberUsers = 36;

  for (var i = 0; i < numberUsers; i++) {
    const page = await browser.newPage();
    await page.goto("https://surveymisinfor.vercel.app/");
    // await page.waitForTimeout(200);

    pages.push(page);
  }
  console.log(pages.length);

  for (var i = 0; i < numberUsers; i++) {
    await pages[i].bringToFront();

    // each inputFields element is a elementHandle object that represents
    // an in-page DOM element
    const inputFields = await pages[i].$$("input");
    // console.log(inputFields);
    await inputFields[0].type(testCases[i]._id);
    await inputFields[1].type(testCases[i].occupation);
    await inputFields[2].type(testCases[i].zip);

    const selectorFields = await pages[i].$$("select");
    await selectorFields[0].type("18-24");
    await selectorFields[1].type("white");
    await selectorFields[2].type("male");
    await selectorFields[3].type(testCases[i].political);
    await selectorFields[4].type(testCases[i].affiliation);
    await selectorFields[5].type("some-college");

    // console.log(selectorFields);

    const submitButton = await pages[i].$("button");
    await submitButton.click();

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  //   for (var i = 0; i < testCases.length; i++) {
  //     console.log(testCases[i]);
  //   }
  //   36 pages
})();
