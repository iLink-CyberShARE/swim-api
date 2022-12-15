//contructor
function CannedScenarios() {}

/**
 * Get list of all canned scenarios
 * @param {*} db database connection instance
 * @param {*} callback callback function
 */
CannedScenarios.prototype.GetAll = function(db, callback){
  db.collection("canned-scenarios").find({}).toArray(function(err, result) {
  if (err) throw err;
  //console.log(JSON.stringify(result));
  callback(result);
  });
};

/**
 * Get canned scenarios by id
 * @param {*} db database connection instance
 * @param {*} id canned scenario unique id
 * @param {*} callback callback function
 */
CannedScenarios.prototype.GetByID = function(db, id, callback){
  db.collection("canned-scenarios").find({'_id': id}).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

/**
 * Inserts a canned scenario document into the canned scenarios collection
 * @param {*} db database connection instance
 * @param {*} document canned scenario document
 * @param {*} callback callback function
 */
CannedScenarios.prototype.CreateCan = function(db, document, callback){
  db.collection('canned-scenarios').insertOne(document, function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

/**
 * Deletes a canned scenario document from the canned scenarios collection
 * @param {*} db database connection instance
 * @param {*} id canned scenario identifier
 * @param {*} callback callback function
 */
CannedScenarios.prototype.DeleteCan = function(db, id, callback){
  var query = { _id: id};
  db.collection('canned-scenarios').deleteOne(query, function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

module.exports = CannedScenarios;
