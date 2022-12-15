// constructor
function SetCatalog() {}

// get by model and language
SetCatalog.prototype.GetByModel = function(db, modelID, callback){
const proj = { projection: { _id: 0, modelID: 0} };
db.collection("set-catalog").find({'modelID': modelID}, proj).toArray(function(err, result) {
  if (err) throw err;
  //console.log(JSON.stringify(result));
  callback(result);
  });
}

module.exports = SetCatalog;
