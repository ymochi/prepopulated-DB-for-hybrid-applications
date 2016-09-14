//Some SQL examples
//In this case database XXX contains two columns
->meaning and form
//The following function gets info from DB.

        //DB open
        $scope.DBopen() //Common function for Debug and Actual Device

	//SELECT DATA
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM XXX where rowid = YYY, [],
              showItemsOnResultSyncRev,
              $scope.sqlError);
        });


    showItemsOnResultSyncRev = function (rt, rs) {

        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var strword = row.meaning; //example
            var strform = row.form;  //example
            
        }
    }


//When INSERT DATA
        //DB open
        $scope.DBopen() //Common function for Debug and Actual Device

                var strsql = "INSERT INTO ZZZ VALUES (?, ?, ?, ? ,?) "
                db.transaction(function (tr) {
                    tr.executeSql(strsql, [_A, _B, _C, _D, _E],
                      function () { console.log("ZZZ OK"); },
                      $scope.sqlError);
                });

//When DELETE DATA
        $scope.DBopen(); 

        db.transaction(function (tr) {
           tr.executeSql("DELETE FROM XXX", [], function () {
            }, sqlError);
         });

//When CREATE TABLE
        $scope.DBopen(); 
        db.transaction(function (tr) {
          tr.executeSql("CREATE TABLE IF NOT EXISTS MMM (AAA TEXT NOT NULL, BBB, CCC)", [], function () {/*when succeed*/ }, sqlError);
        });

//When DROP TABLE
        db2.transaction(function (tr) {
        tr.executeSql("DROP TABLE IF EXISTS MMM", [], function () { /*when succeed*/;}, sqlError);
        });  
 

