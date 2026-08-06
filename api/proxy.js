const fetch = require('node-fetch');

// Кеш в памяти (живёт пока функция тёплая)
let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 минут

export default async function handler(req, res) {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'Параметр url обязателен' });
    }
    
    try {
        // Используем кеш для ГРСИ
        if (url.includes('grsi') && cache && (Date.now() - cacheTime < CACHE_DURATION)) {
            return res.status(200).json({ html: cache, cached: true });
        }
        
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 15000
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `HTTP ${response.status}` });
        }
        
        const html = await response.text();
        
        // Кешируем ГРСИ
        if (url.includes('grsi')) {
            cache = html;
            cacheTime = Date.now();
        }
        
        return res.status(200).json({ html, cached: false });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
