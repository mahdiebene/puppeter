require('dotenv').config();
require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

const BRAIN_URL = process.env.BRAIN_URL || 'http://localhost:5000';

async function startBot() {
    console.log('Bot starting...');

    // Launch browser once
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    while (true) {
        try {
            console.log('Fetching task from Brain...');
            const { data: task } = await axios.get(`${BRAIN_URL}/api/task`);

            if (task && task.url) {
                console.log(`Received task: Scrape ${task.url}`);

                // Scrape logic
                const page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

                console.log(`Navigating to ${task.url}...`);
                await page.goto(task.url, { waitUntil: 'networkidle2', timeout: 60000 });

                // TODO: Actual selector logic for Facebook/Bikroy
                // For now, we'll extract the page title as a "listing" to prove connectivity
                const title = await page.title();
                console.log(`Page title: ${title}`);

                // Mock data extraction
                const listings = [{
                    title: `Scraped: ${title}`,
                    location: 'Badda (Guessed)',
                    rent: '15000',
                    sourceUrl: task.url + '#' + Date.now(), // Unique ID
                    description: 'Scraped by bot'
                }];

                await page.close();

                // Send back to Brain
                console.log('Reporting data to Brain...');
                await axios.post(`${BRAIN_URL}/api/listings`, { listings });
                console.log('Data sent!');

            } else {
                console.log('No task received.');
            }

        } catch (err) {
            console.error('Error in bot loop:', err.message);
        }

        // Wait 30 seconds before next task
        console.log('Sleeping for 30s...');
        await new Promise(r => setTimeout(r, 30000));
    }
}

startBot();
