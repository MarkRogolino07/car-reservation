const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store (array of objects)
let items = [
    { id: 1, name: 'Item A', description: 'Description for Item A' },
    { id: 2, name: 'Item B', description: 'Description for Item B' }
];
let nextId = 3; // To assign unique IDs for new items

// GET all items
app.get('/cars', (req, res) => {
    res.json(items);
});

app.get('/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

app.post('/cars', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).send('Name and description are required');
    }
    const newItem = { id: nextId++, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.put('/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        items[itemIndex] = { ...items[itemIndex], name, description };
        res.json(items[itemIndex]);
    } else {
        res.status(404).send('Item not found');
    }
});

app.delete('/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);

    if (items.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});