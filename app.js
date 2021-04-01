require('dotenv').config();
const express = require('express');
const errorMiddleware = require('./middlewares/error');
const userController = require('./controllers/userController');
const postRoute = require('./routes/postRoute');
const friendRoute = require('./routes/friendRoute');
// const { sequelize } = require('./models');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/posts', postRoute);
app.use('/friends', friendRoute);
app.post('/register', userController.register);
app.post('/login', userController.login);

app.use((req, res) => {
  res.status(404).json({ message: 'path not found on this server' });
});

app.use(errorMiddleware);

// sequelize.sync({ force: true }).then(() => console.log('DB Sync'));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
