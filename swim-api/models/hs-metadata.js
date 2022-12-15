function hsMetadata() {}

/**
 * Get list of all hs-metadata
 * @param {*} db database connection instance
 * @param {*} callback callback function
 */
hsMetadata.prototype.GetAll = function (db, callback) {
  db.collection("hs-metadata")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      //console.log(JSON.stringify(result));
      callback(result);
    });
};

/**
 * Get hs-metadata by scenario_id
 * @param {*} db database connection instance
 * @param {*} scenario_id hs-metadata scenario unique id
 * @param {*} callback callback function
 */
//get model by scenario id
hsMetadata.prototype.GetByScenarioID = function (db, scenario_id, callback) {
  const proj = { projection: { _id: 0 } };
  db.collection("hs-metadata")
    .find({ scenario_id: scenario_id }, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Get hs-metadata by hs_id
 * @param {*} db database connection instance
 * @param {*} hs_id hs-metadata scenario unique id
 * @param {*} callback callback function
 */
//get model by hs id

//get parameter by name
hsMetadata.prototype.GetByHsID = function (db, hs_id, callback) {
  const proj = { projection: { _id: 0 } };
  db.collection("hs-metadata")
    .find({ hs_id: hs_id }, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Insert hs-metadata by scenario id
 * @param {*} db database connection instance
 * @param {*} scenario_id hs-metadat  a scenario unique id*
 * @param {*} user_id hs-metadat  a scenario unique id
 * @param {*} document hs-metadata document
 * @param {*} callback callback function
 */
//update model by scenario id
hsMetadata.prototype.updateMetatData = function (
  db,
  scenario_id,
  user_id,
  document,
  callback
) {db.collection("hs-metadata").replaceOne(
    { 'scenario_id' : scenario_id,  'user_id': user_id},
    document,
    function (err, result) {
      if (err) throw err;
      callback(result);
    }
  );
};

/**
 * Inserts an hs-metadata document into the hs-metadata collection
 * @param {*} db database connection instance
 * @param {*} document hs-metadata document
 * @param {*} callback callback function
 */
hsMetadata.prototype.CreateMetaData = function (db, document, callback) {
  db.collection("hs-metadata").insertOne(document, function (err, result) {
    if (err) throw err;
    callback(result);
  });
};





/**
 * Deletes a hs-metadata document from the hs-metadata collection
 * @param {*} db database connection instance
 * @param {*} scenario_id  hs-metadata identifier
 * @param {*} user_id  hs-metadata identifier
 * @param {*} callback callback function
 */
hsMetadata.prototype.DeleteMetadata = function (db, user_id, scenario_id, callback) {
  
  db.collection("hs-metadata").deleteOne( { 'scenario_id' : scenario_id,  'user_id': user_id},
    function (err, result) {
      if (err) throw err;
      callback(result);
    }
  );
};





module.exports = hsMetadata;
