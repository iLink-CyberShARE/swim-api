function ThemeCatalog() {}

/**
 * Get theme catalog by model id
 */
ThemeCatalog.prototype.GetByModelID = function(db, modelID, callback) {
  const proj = { projection: {} };
  db.collection("theme-catalog").find({ 'modelID': modelID }, proj).toArray(function(
    err,
    result
  ) {
    if (err) throw err;
    callback(result);
  });
};

module.exports = ThemeCatalog;
