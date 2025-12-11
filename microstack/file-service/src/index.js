require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/file.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/file', fileRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
    console.log(`File Service running on port ${PORT}`);
});
