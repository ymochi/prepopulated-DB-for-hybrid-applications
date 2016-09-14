angular.module('app.controllers', ['ionic'])
.controller('YourControlCtrl', function ($scope, $http, $state) {

    $scope.CheckIsVirtual(); 
        if (blnVirtualflg == false) { //actual device
            dbcopy();
        }
 
    function copyerror(e) {
    //db already exists or problem in copying the db file. Check the Log.
     console.log("Error Code = " + JSON.stringify(e)); //for checking
     alert("Error Code = " + JSON.stringify(e));       //for checking
     //e.code = 516 => if db exists
    }

    //SQlite start
    function copysuccess() {
        //open db and run your queries
        //DBopen
        $scope.DBopen() //Common Function (Debug/Actual Device)

        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM YOUR_DB where XXXX", [],
              success_func, //you can put your functions here
              sqlError);
        });

     }

    function dbcopy() {
    //Database filename to be copied
    //location = 0, will copy the db to default SQLite Database Directory
        window.plugins.sqlDB.copy("words.db", 0, copysuccess, copyerror);
    }

})



