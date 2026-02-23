const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Имитация базы данных (список кастрюль)
let products = [
    { id: 1, name: 'Кастрюля "Шеф-Повар" 20л', price: 5990 },
    { id: 2, name: 'Кастрюля эмалированная 5л', price: 1200 },
    { id: 3, name: 'Казан чугунный 12л', price: 3500 },
    { id: 4, name: 'Сотейник антипригарный', price: 2100 },
    { id: 5, name: 'Кастрюля нержавеющая 3л', price: 1800 }
];

// Главная страница
app.get('/', (req, res) => {
    res.send('Добро пожаловать в API Магазина Кастрюль!');
});

// CRUD операции

// 1. Получить все товары (READ ALL)
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. Получить товар по ID (READ ONE)
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

// 3. Создать новый товар (CREATE)
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    // Простая валидация
    if (!name || !price) {
        return res.status(400).json({ error: 'Необходимо указать название и цену' });
    }

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name,
        price: Number(price)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Обновить товар (UPDATE)
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = Number(price);

    res.json(product);
});

// 5. Удалить товар (DELETE)
app.delete('/products/:id', (req, res) => {
    const initialLength = products.length;
    products = products.filter(p => p.id !== parseInt(req.params.id));

    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    res.status(204).send();
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});