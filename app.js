const express = require('express');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config();

// db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true}).then(() => {
    console.log('database connected');
}).catch(err => {
    console.log(err);
});

mongoose.connection.on('error', err => {
    console.log(`Connection faild: ${err.message}`);
})


// MIDDLEWARES
app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(expressValidator());
app.use(cors());
app.use(cookieParser());

// Controllers

// bring in routes
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            error: "Unauthorized!"
        });
    }
});

// Api Docs

app.get('/', (req,res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }

        const docs = JSON.parse(data);
        res.json(docs);
    })
})


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
})
