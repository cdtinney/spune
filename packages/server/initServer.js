module.exports = function initServer(app) {
  const port = process.env.PORT || 5000;
  app.listen(port, console.log.bind(null, `Listening on port ${port}`));
}
