// constructor
function SummaryCatalog() {}

// get by model and language
SummaryCatalog.prototype.GetByModel = function(db, modelID, callback){
const proj = { projection: { _id: 0 } };
db.collection("summary-catalog").find({ 'modelID': modelID }, proj).toArray(function(
    err,
    result
  ) {
    if (err) throw err;
    callback(result);
  });
};

module.exports = SummaryCatalog;
