const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.set('views', 'views');

const userRoutes = require('./routes/user');
const forgotpasswordRoutes = require('./routes/forgotpassword');

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(userRoutes);
app.use(forgotpasswordRoutes);

const PORT = process.env.PORT;

sequelize.sync().then(result => {
    app.listen(PORT);
})
.catch(err => console.log(err));
