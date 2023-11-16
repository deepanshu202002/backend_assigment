const express = require('express');
const bodyParser = require('body-parser');
const quizRoutes = require('./quizRoutes')

const app = express();
const PORT = 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', quizRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
