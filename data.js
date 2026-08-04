const defaultData = {
    heroTitle: 'Разработка <span class="gradient-text">Telegram & VK ботов</span> и современных сайтов',
    heroSubtitle: 'Создаем надежные цифровые решения для автоматизации вашего бизнеса, увеличения продаж и эффективного взаимодействия с клиентами.',
    services: [
        {
            title: 'Telegram-боты',
            price: 'от 7 000 ₽',
            icon: 'fa-brands fa-telegram',
            desc: 'Сложная логика, интеграция с базами данных, приемами оплаты, автовыдачей товаров и админ-панелями.',
            link: 'https://vk.ru/flash_programstudio'
        },
        {
            title: 'VK-боты',
            price: 'от 6 000 ₽',
            icon: 'fa-brands fa-vk',
            desc: 'Автоматизация сообществ, рассылки, игровое взаимодействие, чат-боты поддержки и лидогенерации.',
            link: 'https://vk.ru/flash_programstudio'
        },
        {
            title: 'Веб-сайты & Лендинги',
            price: 'от 12 000 ₽',
            icon: 'fa-solid fa-laptop-code',
            desc: 'Современные, адаптивные сайты, сфокусированные на конверсию и презентацию ваших услуг.',
            link: 'https://vk.ru/flash_programstudio'
        }
    ],
    reviews: [
        {
            author: "Алексей М.",
            initials: "АМ",
            category: "Разработка Telegram-бота",
            rating: 5,
            text: "Заказывали бота для приема оплаты и парсинга данных. Всё сделано оперативно, код чистый, админка понятная. Антон всегда на связи!"
        },
        {
            author: "Дмитрий К.",
            initials: "ДК",
            category: "Разработка веб-сайта",
            rating: 5,
            text: "Сделали стильный и быстрый лендинг под ключ. Адаптив под мобилки идеальный, сделали точно в срок. Большое спасибо!"
        },
        {
            author: "Елена В.",
            initials: "ЕВ",
            category: "Автоматизация VK",
            rating: 5,
            text: "Настроили чат-бота для группы ВК, всё подробно объяснили и подготовили инструкцию. Клиентам очень удобно, автоответы работают мгновенно."
        }
    ]
};

function getSiteData() {
    const saved = localStorage.getItem('flash_site_data');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка чтения данных", e);
        }
    }
    return defaultData;
}

function saveSiteData(data) {
    localStorage.setItem('flash_site_data', JSON.stringify(data));
}