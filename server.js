const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Fl@sh_2026!Sec3re';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('⚡ Сервер FLASH Studio запущен с GitHub API (native)!');
});

// Вспомогательная функция для запросов к GitHub API через встроенный https
function githubRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const dataStr = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`,
            method: method,
            headers: {
                'User-Agent': 'Node.js-Server',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(dataStr) } : {})
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', err => reject(err));
        if (dataStr) req.write(dataStr);
        req.end();
    });
}

// 1. Получить данные сайта
app.get('/api/data', async (req, res) => {
    try {
        const response = await githubRequest('GET', '/contents/data.json');
        
        if (response.status === 200 && response.data.content) {
            const content = Buffer.from(response.data.content, 'base64').toString('utf8');
            return res.json(JSON.parse(content));
        }

        // Если файла еще нет
        res.json({
            heroTitle: "FLASH Program Studio — Разработка сайтов и ботов",
            heroSubtitle: "Сделаем всё в лучшем виде специально для Вас",
            services: [],
            reviews: []
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка загрузки с GitHub: ' + err.message });
    }
});

// 2. Сохранить данные сайта
app.post('/api/data', async (req, res) => {
    const userPassword = req.headers['x-admin-password'];

    if (userPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Неверный пароль доступа!' });
    }

    try {
        const newDataString = JSON.stringify(req.body, null, 2);
        const encodedContent = Buffer.from(newDataString).toString('base64');

        // Сначала получаем SHA файла (если он уже существует)
        let fileSha = null;
        const checkFile = await githubRequest('GET', '/contents/data.json');
        if (checkFile.status === 200 && checkFile.data.sha) {
            fileSha = checkFile.data.sha;
        }

        // Отправляем изменения в репозиторий
        const payload = {
            message: 'Update site data via admin panel',
            content: encodedContent,
            ...(fileSha ? { sha: fileSha } : {})
        };

        const updateRes = await githubRequest('PUT', '/contents/data.json', payload);

        if (updateRes.status === 200 || updateRes.status === 201) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'GitHub API error: ' + JSON.stringify(updateRes.data) });
        }
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сохранения: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});