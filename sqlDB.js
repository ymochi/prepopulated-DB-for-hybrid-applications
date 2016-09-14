//This is an interface between Javascript and Java
//exec(success, error, "sqlDB", "copy", [dbname, location]);
//sqlDB->Called name in native code
//copy->native method name 
//this file is called when you call this function->window.plugins.sqlDB.copy("XXX.db", 0, copysuccess, copyerror);
var exec = require('cordova/exec');

exports.copy = function(dbname, location, success, error) {
  exec(success, error, "sqlDB", "copy", [dbname, location]);
};

exports.remove = function(dbname, location, success,error) {
  exec(success, error, "sqlDB", "remove", [dbname, location]);
};
