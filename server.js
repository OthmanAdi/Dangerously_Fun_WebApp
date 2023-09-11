const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(express.json());

app.post('/api/download', (req, res) => {
    const { url, format } = req.body;

    // IMPORTANT: Be VERY careful with this; running shell commands
    // from user input can be risky. Always sanitize and validate the input.
    exec(`spotdl ${url}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Download failed' });
        }

        // You'd usually do something more sophisticated here, like
        // sending back a download link for the file.
        res.status(200).json({ success: true, message: 'Downloaded successfully!' });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
