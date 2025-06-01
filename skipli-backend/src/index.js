const express = require("express");
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Cho phép front-end gọi API
app.use(express.json()); // Parse JSON body

app.use('/api', apiRoutes);
app.get("/health", async (req, res) => {
  res.send({ message: "health OK!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
