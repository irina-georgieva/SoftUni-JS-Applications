const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = {
    "d953e5fb-a585-4d6b-92d3-ee90697398a0": {
        "author": "J.K.Rowling",
        "title": "Harry Potter and the Philosopher's Stone"
    },
    "d953e5fb-a585-4d6b-92d3-ee90697398a1": {
        "author": "Svetlin Nakov",
        "title": "C# Fundamentals"
    }
};

function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'ContentType': 'application/json'
        },
        body: JSON.stringify(data)
    }
}

describe('Tests', async function () {
    this.timeout(6000);

    let page, browser;

    before(async () => {
        //browser = await chromium.launch({headless: false, slowMo: 500});
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('loads and displays all books', async () => {
        await page.route('**/jsonstore/collections/books*', (route, request) => {
            route.fulfill(json(mockData));
        });

        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');

        await page.waitForSelector('text=Harry Potter');

        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));

        expect(rows[1]).to.contains('Harry Potter');
        expect(rows[1]).to.contains('Rowling');
        expect(rows[2]).to.contains('C# Fundamentals');
        expect(rows[2]).to.contains('Nakov');
    });

    it('can create book', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('form#createForm >> input[name="title"]', 'Title');
        await page.fill('form#createForm >> input[name="author"]', 'Author');

        await page.click('text=LOAD ALL BOOKS');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('form#createForm >> text=Submit')
        ]);

        const data = JSON.parse(request.postData());
        expect(data.title).to.equal('Title');
        expect(data.author).to.equal('Author');

        //await page.waitForTimeout(60000);
    });

    it('can edit book', async () => {
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');

        await page.click('tbody >> td >> text=Edit');

        await page.fill('form#editForm >> input[name="title"]', 'New Title');
        await page.fill('form#editForm >> input[name="author"]', 'New Author');

        const name = await page.textContent('tbody >> tr >> :nth-child(1)');
        const author = await page.textContent('tbody >> tr >> :nth-child(2)');

        expect(name).to.equal('New Title');
        expect(author).to.equal('New Author');

    });

    it.only('delete book', async () => {
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');

        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));
        console.log(rows.length);

        await page.textContent('tbody >> tr >> :nth-child(1)');

        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        await page.click('tbody >> tr >> td >> text=Delete');
        await page.click('text=Load All Books');

        const newRows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));
        console.log(newRows.length);

        expect(newRows.length).to.equal(rows.length - 1);
    });

})