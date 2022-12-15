function CustomScenarioCatalog() {}

/**
 * Get metadata from all public scenarios
 * @param {*} db database instance
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetPublicMetadata = function (db, callback) {
  const proj = {
    projection: { modelInputs: 0, modelOutputs: 0, modelSets: 0 },
  };
  db.collection("public-scenarios")
    .find({}, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Get a public scenario by unique identifier
 * @param {*} db database instance
 * @param {*} id unique identifier
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetPublicScenarioByID = function (
  db,
  id,
  callback
) {
  db.collection("public-scenarios").findOne({ _id: id }, function (
    err,
    result
  ) {
    if (err) throw err;
    callback(result);
  });
};

/**
 * Get a private scenario by unique id
 * @param {*} db database instance
 * @param {*} id unique identifier
 * @param {*} callback callback function
 * TODO: protect this method against user id
 */
CustomScenarioCatalog.prototype.GetPrivateScenarioByID = function (
  db,
  id,
  callback
) {
  const proj = {};
  db.collection("private-scenarios").findOne({ _id: id }, proj, function (
    err,
    result
  ) {
    if (err) throw err;
    callback(result);
  });
};

/**
 * Get all private scenario metadata from a specific user
 * @param {*} db database instance
 * @param {*} userid user identifier
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetUserPrivateScenarios = function (
  db,
  userid,
  callback
) {
  userid = userid.toString();
  const proj = {
    projection: { userid: 0, modelInputs: 0, modelOutputs: 0, modelSets: 0 },
  };
  db.collection("private-scenarios")
    .find({ userid: userid }, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Delete a user private scenario
 * @param {*} db database instance
 * @param {*} id scenario identifier
 * @param {*} userid user identifier
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.DeleteUserPrivateScenario = function (
  db,
  id,
  userid,
  callback
) {
  const proj = {};
  userid = userid.toString();
  db.collection("private-scenarios").findOneAndDelete(
    { _id: id, userid: userid },
    proj,
    function (err, result) {
      if (err) throw err;
      callback(result);
    }
  );
};

/**
 * Retrieve execution metadata by model identifier
 * @param {*} db database instance
 * @param {*} modelid model identifier
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetPublicScenarioByModel = function (
  db,
  modelid,
  callback
) {
  const proj = {
    projection: { modelInputs: 0, modelOutputs: 0, modelSets: 0 },
  };
  const query = { "modelSettings.modelID": modelid };
  db.collection("public-scenarios")
    .find(query, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Retrieve private user execution metadata by model identifier
 * @param {*} db database instance
 * @param {*} modelid model identifier
 * @param {*} userid user identifier
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetPrivateScenarioByModel = function (
  db,
  modelid,
  userid,
  callback
) {
  const proj = {
    projection: { modelInputs: 0, modelOutputs: 0, modelSets: 0 },
  };
  const uid = userid.toString();
  const query = {"modelSettings.modelID": modelid,  "userid": uid};
  db.collection("private-scenarios")
    .find(query, proj)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 * Gets specific model outputs from a set of model scenarios
 * @param {*} db database instance
 * @param {*} scenarioids list of scenario ids
 * @param {*} outputnames list of unique output names
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetFilteredScenarioOutputs = function (
  db,
  scenarioids,
  outputnames,
  callback
) {
  const pipeline = [
    { $match: { _id: { $in: scenarioids } } },
    { $unwind: "$modelOutputs" },
    { $match: { "modelOutputs.varName": { $in: outputnames } } },
    {
      $group: {
        _id: {
          id: "$_id",
          name: "$name",
          description: "$description",
          start: "$start",
        },
        modelOutputs: { $push: "$modelOutputs" },
      },
    },
  ];
  db.collection("public-scenarios")
    .aggregate(pipeline)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

/**
 *
 * @param {*} db database instance
 * @param {*} uid user identifier
 * @param {*} scenarioids list of scenario ids
 * @param {*} outnames list of unique output names
 * @param {*} callback callback function
 */
CustomScenarioCatalog.prototype.GetPrivateFilteredScenarioOutputs = function (
  db,
  userid,
  scenarioids,
  outputnames,
  callback
) {
  const uid = userid.toString();
  const pipeline = [
    { $match: { $and: [{ _id: { $in: scenarioids } }, { "userid": uid }] } },
    { $unwind: "$modelOutputs" },
    { $match: { "modelOutputs.varName": { $in: outputnames } } },
    {
      $group: {
        _id: {
          id: "$_id",
          name: "$name",
          description: "$description",
          start: "$start",
        },
        modelOutputs: { $push: "$modelOutputs" },
      },
    },
  ];
  db.collection("private-scenarios")
    .aggregate(pipeline)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};







module.exports = CustomScenarioCatalog;
