const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // access to file system
require('dotenv').config()
const port = process.env.PORT || 9000 ;
const path = require("path");

// APP
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useFindAndModify:false
    })
    .then(() => console.log('database connection success'))
    .catch(err => console.log(`DB CONNECTION ERR ${err}`));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));
//middleware-routes
fs.readdirSync('./src/routes').map((routeFile) => app.use('/api', require('./src/routes/' + routeFile)));

app.listen(port, () => {
    console.log(`Magic happens at ${port}`);
});


// try {
        
// } catch (err) {
//     res.status(400).json(err);
// }