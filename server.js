require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "views");
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 3000;
const passport = require('passport');
const flash    = require('connect-flash');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const configDB = require('./config/db/models/index.js');

require('./config/passport-config.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set("views", viewsFolder);
app.set('view engine', 'ejs');
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(session({ secret: 'stravaline' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Take a look on port ' + port);
