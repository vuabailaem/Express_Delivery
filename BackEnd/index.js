import express from "express";

const APP = express();
APP.get('/', (req, res) => {
    console.log('REQUEST AT ROOT...');
    res.json({ status: true});
});
APP.listen(8082, () => {
    console.log('SERVER IS LISTENING AT PORT 8082');
});