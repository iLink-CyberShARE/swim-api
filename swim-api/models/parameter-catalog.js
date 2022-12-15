//constructor
function ParameterCatalog() { }

//get all parameters
ParameterCatalog.prototype.GetAll = function(db, callback){
  const proj = { projection: { _id: 0} };
  db.collection("parameter-catalog").find({}, proj).toArray(function(err, result) {
  if (err) throw err;
  //console.log(JSON.stringify(result));
  callback(result);
  });
};

//get parameters by model
ParameterCatalog.prototype.GetByModel = function(db, modelID, callback){
  const proj = { projection: { _id: 0} };
  db.collection("parameter-catalog").find({'modelID': modelID}, proj).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

//get parameter by name
ParameterCatalog.prototype.GetByName = function(db, paramName, callback){
const proj = { projection: { _id: 0} };
db.collection("parameter-catalog").find({'paramName': paramName}, proj).toArray(function(err, result) {
  if (err) throw err;
  callback(result);
  });
};

module.exports = ParameterCatalog;


