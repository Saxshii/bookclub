const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = (passport) => {

 
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, 
      async (email, password, done) => {
        try {
          // 1. Find user by email
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            return done(null, false, { message: 'No account found with that email.' });
          }

          // 2. Compare entered password with hashed password in DB
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          // 3. All good — return the user
          return done(null, user);

        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialize 
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

//   Deserialize
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};