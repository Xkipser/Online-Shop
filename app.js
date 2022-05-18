const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const csrf = require('csurf');

const createSession = require('./config/session');
const csrfTokenMiddleware = require('./middlewares/csrf-middleware');
const authMiddleware = require('./middlewares/auth-middleware');
const errorMiddleware = require('./middlewares/error-middleware');
const protectRoutes = require('./middlewares/protect-routes');
const notFoundMiddleware = require('./middlewares/not-found-middleware');
const updateCart = require('./middlewares/update-cart-middleware');
const db = require('./data/database');
const adminRoutes = require('./routes/admin-rout');
const clientRoutes = require('./routes/client-rout');
const ordersRoutes = require('./routes/orders-rout');
const cartMiddleware = require('./middlewares/cart');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/product/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSession();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCart);

app.use(csrfTokenMiddleware);
app.use(authMiddleware);

app.use(clientRoutes);
app.use(protectRoutes, ordersRoutes);
app.use('/admin', protectRoutes, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

db.connectToDatabase().then(function() {
    app.listen(3000);
});