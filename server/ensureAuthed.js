module.exports = (req, res, next) => {
  console.log('[IsAuthed?]\n', req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};
