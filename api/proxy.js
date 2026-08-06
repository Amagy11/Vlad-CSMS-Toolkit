export default async function handler(req, res) {
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
        // Используем встроенный fetch (Node 18+)
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(15000)
        });
        
        if (!response.ok) {
            return res.status(500).json({ error: `HTTP ${response.status}` });
        }
        
        const html = await response.text();
        return res.status(200).json({ html });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
