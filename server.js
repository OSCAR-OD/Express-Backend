require('dotenv').config()
require('express-async-errors')
const bodyParser = require("body-parser");
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

//app.use(express.json())

// app.use(bodyParser.json({limit: '100mb'}));
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     limit: '100mb',
//     extended: true
//     }));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(cookieParser())

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.urlencoded({ extended: true }));

//app.use(bodyParser.json({ limit: "10mb" }));
//app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/employees', require('./routes/employeeRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
//app.use('/notis', require('./routes/notiRoutes'))
app.use('/teams', require('./routes/teamRoutes'))
app.use('/forms', require('./routes/formRoutes'))
app.use('/products', require('./routes/productRoutes'))
app.use('/notices', require('./routes/noticeRoutes'))
app.use('/posts', require('./routes/postRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
