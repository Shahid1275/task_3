const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000; // i choose this but you can Choose any port you prefer

// Middleware we use for
app.use(bodyParser.json());

// Temporary data store
let items = [
    { id: 1, title: 'Basics of javascript', duration: '2 hours', link: 'https://w3school.com', status: 'show' },
    { id: 2, title: 'javaScript functions', duration: '1.5 hours', link: 'https://w3school.com', status: 'hide' },
    { id: 3, title: 'javaScript advanced', duration: '3.5 hours', link: 'https://w3school.com', status: 'hide' },
    // if you want to Add more items as needed then add it as same above code
];
// Routes

// Get all items with optional filter by selected items with port and we get all items
app.get('/items', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filteredItems = items.filter(item => item.status === status);
        res.json(filteredItems);
    } else {
        res.json(items);
    }
});

// Get a single item by ID than this code works
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const foundItem = items.find(item => item.id === itemId);
    if (foundItem) {
        res.json(foundItem);
    } else {
        res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }
});

// Create a new item with this code in the body of the raw and select json for create new item

app.post('/items', (req, res) => {
    const { title, duration, link } = req.body;
    const newItem = {
        id: items.length + 1,
        title,
        duration,
        link,
        status: 'show' // Default status
    };
    items.push(newItem);
    res.status(201).json(newItem); // 201 Created
});

// if we want to Update an existing item by ID then this code execute in backend
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { title, duration, link } = req.body;
    let updated = false;
    items = items.map(item => {
        if (item.id === itemId) {
            item.title = title;
            item.duration = duration;
            item.link = link;
            updated = true;
        }
        return item;
    });
    if (updated) {
        res.json({ message: `Item with ID ${itemId} updated` });
    } else {
        res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }
});

// if you Delete an item by ID then this code execute 
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(item => item.id !== itemId);
    if (items.length < initialLength) {
        res.json({ message: `Item with ID ${itemId} deleted` });
    } else {
        res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }
});

// Change status of an item (Hide/Show) then you can go in the post man and test that code correct execute or not
app.patch('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { status } = req.body;
    const item = items.find(item => item.id === itemId);

    if (!item) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }

    if ((item.status === 'hide' && status === 'show') || (item.status === 'show' && status === 'hide')) {
        item.status = status;
        res.json({ message: `Status of item with ID ${itemId} changed to ${status}` });
    } else {
        res.status(400).json({ message: `Invalid status change request for item with ID ${itemId}` });
    }
});

// from this code Start the server on which i work here 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
