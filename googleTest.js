const {By, Builder, Browser, Key} = require('selenium-webdriver');
const assert = require("assert");
const firefox = require('selenium-webdriver/firefox');
const {Options} = firefox;


const baseUrl = 'https://google.com';

const searchText = 'Igor Peshkov';

const browser = Browser.CHROME;

const clearField = async (field) => {
    await field.click();
    await field.clear();
    await field.sendKeys(Key.CONTROL + "a");
    await field.sendKeys(Key.DELETE)
}

(async function helloSelenium() {
    let driver;

    switch (browser) {
        case Browser.FIREFOX:
            const options = new Options();
            options.setAcceptInsecureCerts(true);
            driver = await new Builder().forBrowser(browser).setFirefoxOptions(options).build();
            break;
        default:
            driver = await new Builder().forBrowser(browser).build();
            break;
    }

    try {
        await driver.get(baseUrl);
        await driver.manage().setTimeouts({implicit: 1000});

        let title = await driver.getTitle();
        assert.equal(title, "Google");//*[@id="rso"]

        await driver.manage().setTimeouts({implicit: 500});

        // google search page
        let searchField = await driver.findElement(By.name('q'));
        let searchBtn = await driver.findElement(By.name('btnK'));

        await clearField(searchField);
        await searchField.sendKeys(searchText);

        await searchBtn.click();

        await driver.manage().setTimeouts({implicit: 500});

        // search result page
        let firstResult = await driver.findElement(By.xpath('//*[@id="rso"]/div[1]//a'));
        await firstResult.click();

        await driver.manage().setTimeouts({implicit: 500});

        // first result page, waiting for wikipedia =) sometimes get images as first result
        let mainContentWrapper = await driver.findElement(By.xpath('//span[@class="mw-page-title-main"]'));
        let value = await mainContentWrapper.getText();

        assert.equal("Igor Peshkov", value);
    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }
})();