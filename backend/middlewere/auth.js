// middleware/auth.js
module.exports = function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
};
