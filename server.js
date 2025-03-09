
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/users', require('./users/user.controller'));


app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3306;
app.listen(port, () => console.log('Server listening on port ' + port));