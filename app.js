const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
//const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passportConfig = require(path.join(__dirname, 'passport'))
const { sequelize } = require(path.join(__dirname, 'models')); 
const env = process.env.MODE_ENV || 'development';
const config = require(path.join(__dirname, 'config', 'config.json'))[env];

require('dotenv').config();
app.set('port', process.env.PORT);
//app.use(expressLayouts);
//app.set('layout', 'layouts/main');    //rendering시 layout을 생략할 수 있다. 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, 'public')));

//passport initialize
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie :{
        httpOnly : true,
        secure : false,
        },
    name: process.env.SESSION_NAME,
    },
));
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('production'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
  console.log(`app.use((req, res, next) : ${req.user ? req.user.id : 'not logged in'}`);
  res.locals.user = req.user ? req.user : null ;
  next();
});

//router...
app.use('/', require(path.join(__dirname, 'routes')));   //index.js는 생략 가능

//next middleware
app.use((req, res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

//error middleware
app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.MODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});


//connect to database
sequelize.sync({force:false})
    .then(()=>{
        console.log(`${config.database} is connected`);    
    })


app.listen(app.get('port'), ()=>{
    console.log(`${app.get('port')} is opened`);
})
.on('listening', ()=>{
    console.log(`${app.get('port')} is listening`);
})
.on('close', ()=>{
    console.log(`${app.get('port')} is closed`);
})
.on('error', ()=>{
    console.log(`${error}`);
})
