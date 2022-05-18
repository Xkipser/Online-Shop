const db = require('../data/database');

async function auth(req, res, next) {
    const user = req.session.user;
    const isAuth = req.session.isAuthenticated;
  
    if (!user || !isAuth) {
      return next();
    }

    const userDoc = await db.getDb().collection('users').findOne({ _id: user.id });
    
    res.locals.uid = user.id;
    res.locals.isAuth = isAuth;
    res.locals.isAdmin = userDoc.isAdmin;
  
    next();
}

module.exports = auth;