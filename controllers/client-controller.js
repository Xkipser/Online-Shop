const Client = require('../models/client-model');
const Product = require('../models/product-model');
const sessionValidation = require('../util/validation-session');
const validation = require('../util/validation');

async function getHome(req, res) {
    try {
        const products = await Product.findAll();
        
        res.render('home', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

function getSignup(req, res) {
    const sessionErrorData = sessionValidation.getSessionData(
        req,
        {
            email: '',
            confirmEmail: '',
            password: '',
            name: '',
            street: '',
            postalCode: '',
            city: ''
        }
    );

    res.render('signup', { inputData: sessionErrorData });
}

async function postSignup(req, res) {
    const clientData = req.body;
    const userData = {
        email: clientData.email,
        confirmEmail: clientData['confirm-email'],
        password: clientData.password,
        name: clientData.name,
        street: clientData.street,
        postalCode: clientData['postal-code'],
        city: clientData.city
    }

    if (!validation.signupIsValid(userData)) {
        sessionValidation.flashErrorsToSession(
            req,
            {
                message: 'Invalid input!',
                ...userData
            },
            function() {
                res.redirect('/signup');
            }
        );

        return;
    }

    const newClient = new Client(userData);
    const existingUser = await newClient.findUser();

    if (existingUser) {
        sessionValidation.flashErrorsToSession(
            req,
            {
                message: 'User already exists!',
                ...userData
            },
            function() {
                res.redirect('/signup');
            }
        );

        return;
    }

    await newClient.insertUser();

    res.redirect('/login');
}

function getLogin(req, res) {
    const sessionErrorData = sessionValidation.getSessionData(
        req,
        {
            email: '',
            password: ''
        }
    );

    res.render('login', { inputData: sessionErrorData });
}

async function postLogin(req, res) {
    const userData = req.body;
    const data = {
        email: userData.email,
        password: userData.password
    }

    if (!data.email || !data.password) {
        sessionValidation.flashErrorsToSession(
            req,
            {
                message: 'Invalid input!',
                ...data
            },
            function() {
                res.redirect('/login');
            }
        );

        return;
    }

    const newClient = new Client(data);
    const existingUser = await newClient.findUser();

    if (!existingUser) {
        sessionValidation.flashErrorsToSession(
            req, 
            {
                message: 'Could not login!',
                ...data
            },
            function() {
                res.redirect('/login');
            }
        );

        return;
    }

    const passwordAreEqual = await newClient.comparePass(existingUser.password);

    if (!passwordAreEqual) {
        sessionValidation.flashErrorsToSession(
            req, 
            {
                message: 'Could not login!',
                ...data
            },
            function() {
                res.redirect('/login');
            }
        );

        return;
    }

    req.session.user = { 
        id: existingUser._id, 
        email: existingUser.email,
        name: existingUser.name,
        street: existingUser.street,
        postal: existingUser.postal,
        city: existingUser.city 
    };
    req.session.isAuthenticated = true;
    req.session.save(function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/');
}

module.exports = {
    getHome: getHome,
    getSignup: getSignup,
    postSignup: postSignup,
    getLogin: getLogin,
    postLogin: postLogin,
    logout: logout
}