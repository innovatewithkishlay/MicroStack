const path = require('path');

const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;

    res.status(201).json({
        status: 'success',
        data: {
            fileId: req.file.filename,
            url: fileUrl
        }
    });
};

const getFile = (req, res) => {
    const { id } = req.params;
    const filePath = path.join(__dirname, '../../uploads', id);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ status: 'fail', message: 'File not found' });
        }
    });
};

module.exports = { uploadFile, getFile };
