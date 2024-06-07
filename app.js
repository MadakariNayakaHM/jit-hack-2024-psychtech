const express = require("express");
const path = require('path');
const pug = require('pug');
const cookieParser = require('cookie-parser')

const viewsRoutes = require("./routes/viewsRoutes");
const userRoutes = require("./routes/userRouter");
const serverRoutes = require('./routes/serverRoutes');
const clientRoutes = require('./routes/clientRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.body);
    next();
})

app.use("/api/v1/user", userRoutes);
app.use('/', viewsRoutes)
app.use("/api/v1/server", serverRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/predict", predictionRoutes);


module.exports = app;