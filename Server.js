const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const standardSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: String,
    interval: Number,
});

const Standard = mongoose.model('Standard', standardSchema);

// Получение эталонов
app.get('/api/standards', async (req, res) => {
    const standards = await Standard.find();
    res.json(standards);
});

// Добавление нового эталона
app.post('/api/standards', async (req, res) => {
    const newStandard = new Standard(req.body);
    await newStandard.save();
    res.status(201).json(newStandard);
});

// Удаление эталона
app.delete('/api/standards/:id', async (req, res) => {
    await Standard.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
