const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const mongoURI = "mongodb+srv://sybethofman_db_user:523cobrabooks@cluster0.hqiyc3d.mongodb.net/?appName=Cluster0";

app.use(express.json({limit: "50mb"}));

app.use(express.static(__dirname, {
    etag: false,
    lastModified: false
}));

app.use(cors({ origin: "http://localhost:3000" }));


app.use(bodyParser.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/api/users", require("./routes/userRoute"));
app.use("/api/messages", require("./routes/messageRoute"));
app.use("/api/items", require("./routes/itemRoute"));

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
    })
    .catch(err => console.error('Failed to connect to MongoDB:', err));