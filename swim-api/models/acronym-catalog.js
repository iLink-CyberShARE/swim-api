// constructor
function AcronymCatalog() {}

// get by model and language
AcronymCatalog.prototype.GetByModelnLanguage = function(db, modelID , lang, callback){
const proj = { projection: { _id: 0, dictionary: 1} };
db.collection("acronym-catalog").findOne({'modelID': modelID, 'lang': lang}, proj, function(err, result) {
  if (err) throw err;
  callback(result);
  });
}

/**
 * Inserts an acronym catalog document into the acronym catalog collection
 * @param {*} db database connection instance
 * @param {*} document acronymn catalog document
 * @param {*} callback callback function
 */
AcronymCatalog.prototype.CreateAcrCatalog = function (db, document, callback) {
  db.collection("acronym-catalog").insertOne(document, function (err, result) {
    if (err) throw err;
    callback(result);
  });
};



/**
 * Inserts an acronym catalog document into the acronym catalog collection
 * @param {*} db database connection instance
 * @param {*} document acronymn catalog document
 * @param {*} model_id callback function
 * @param {*} callback callback function
 */
 AcronymCatalog.prototype.UpdateAcrCatalog = function (db, model_id, document, callback) {
  const proj = { projection: { _id: 0 } };
  db.collection("acronym-catalog").update({ "modelID" : model_id}, {$set: {"dictionary" : { document }}}, function (err, result) {
    if (err) throw err;
    callback(result);
  });
};



module.exports = AcronymCatalog;
