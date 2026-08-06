import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Кеш в памяти
let cachedData = null;
let cacheTime = 0;
const CACHE_MINUTES = 30;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    try {
        // Проверяем кеш
        if (cachedData && (Date.now() - cacheTime < CACHE_MINUTES * 60 * 1000)) {
            return res.json({ data: cachedData, cached: true });
        }
        
        // Запускаем браузер
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        
        const page = await browser.newPage();
        
        // Идём на сайт
        await page.goto('https://www.oei.by/grsi', { waitUntil: 'networkidle0', timeout: 20000 });
        
        // Ждём появления таблицы
        await page.waitForSelector('table', { timeout: 10000 });
        
        // Забираем данные из таблицы
        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tr');
            const result = [];
            
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');
                if (cells.length >= 4) {
                    result.push({
                        registry: cells[3].textContent.trim(),
                        name: cells[1].textContent.trim()
                    });
                }
            }
            return result;
        });
        
        await browser.close();
        
        // Кешируем
        cachedData = data;
        cacheTime = Date.now();
        
        return res.json({ data, cached: false });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
