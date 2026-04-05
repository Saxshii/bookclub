const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); 
  }
  req.flash('error', 'You need to log in to access that page.');
  res.redirect('/auth/login');
};


const isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/'); 
};

module.exports = { isAuth, isGuest };