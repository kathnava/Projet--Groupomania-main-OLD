const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');
const path = require('path');
const apiRouter = require('./server/route/apiRouter').router;
const cors = require('cors');
// const userfetch = require('./userfetch');
const { render } = require('ejs');
const { response } = require('express');
const jwtUtils  = require('./jwtUtils');

const corsOptions = {
    'Access-Control-Allow-Origin': '*'
}

// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors(corsOptions))


// config view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.set('/img', path.join(__dirname + 'public/img'));


server.use(express.static(path.join(__dirname + '/public')));

// Declare view routes
server.get('/register', (req, res) => {
    res.render('register')
    
});
server.get('/login', (req, res) => {
    res.render('connexion')
});
server.get('/', (req, res) => {
    const token = req.cookies.auth;
    var bearer = 'Bearer ' + token;
    let userId = jwtUtils.getUserId(token)
    console.log('homeToken ', userId);
    const data = {
        texte: req.body.texte,
        userId : userId,
    };
    const defaultOptions = {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
        
        },
        data: data
    };
    fetch('http://localhost:3500/new', defaultOptions)
    .then((res) => res.json())
    .then((res) => {
        console.log(res + '---reess---');
        return res
    })  
    .catch(err => {
      console.log('----- LALALALALA----', err);
    });
    res.render('home')
});

// const getAllUsers = async (defaultOptions) => {
//    const res = await fetch('http://localhost:3500/me', defaultOptions)
//    return res;
// }

server.get('/profil', (req, res) => {
    const token = req.cookies.auth;
    var bearer = 'Bearer ' + token;
    const defaultOptions = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
        },
    };
    // let data = getAllUsers(defaultOptions)
    // getAllUsers().then(data => {
    //     console.log(data)
    // })
    
    console.log('heyyy', defaultOptions);

    fetch('http://localhost:3500/me', defaultOptions)
    .then((res) => res.json())
    .then((res) => {
        console.log(res.Authorization + '---reess---');
        return res
    })  
    .catch(err => {
      console.log('----- LALALALALA----', err);
    });

    return res.render('profil', res)
});

// Declare API routes
server.use('/', apiRouter);

server.listen(3500, function() {
    console.log('Server en écoute :)');
})
