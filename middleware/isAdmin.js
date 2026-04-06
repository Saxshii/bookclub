module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'Access denied.');
  res.redirect('/');
};
