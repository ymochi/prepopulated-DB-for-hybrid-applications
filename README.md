# How to apply Prepopulated database in cross platform (hybrid) applications-- Cordova (and IONIC, Phonegap) with Visual Studio 2015
When developing a cross platform (Android, IOS) application, we often need to have a relatively large prepopulated database. However, it  is almost impossible to make prepopulated DB in WebSQL (If we insert data in WebSQL on our local machines, we cannot deploy it).
<p>
Here is one answer to create prepolulated DB in hybrid application (SQlite ver). <br>
(This solution does not use "storage adapter", but uses original SQL functions)
</p>
<p>
You need two plugins.<br><b>
1) Cordova-sqlite-evcore-extbuild-free<br>
2) cordova-plugin-dbcopy<br></b>
->Apply these two plugins in Visual Studio (please open config.xml and you can easily add these plugins)<br>
*Currently, "Cordova-sqlite-evcore-extbuild-free" is the only plugin that has no error when packaging files in Phonegap. 

And you need to make prepopulated DB by using "DB Browser for SQLite"<br>
->http://sqlitebrowser.org/<br>
(you'll get db file such as "words.db")<br>
->This db file is located on www/ folder<br>

Since we have to debug our project on Visual Studio (e.g., ripple our projects), WebSQL is also necesarry to confirm the implemented functions on Visual Studio. So please remain WebSQL functions if you already created!<br>
->You can check your functions by using WebSQL (Visual Studio, ripple). After completing debugs, you'll check the functions on your actual device(iPhone or Android).  <br>
(WebSQL and SQlite are quite similar, so I strongly recommend use both methods in your hybrid (cross platform application)).<br>

In the source codes, there are two simple steps.<br>
<b>1) Check environmemt (virtual or actual device)<br>
 2) dbcopy();</b><br>
*After copying db file, you can use SQLs in normal way. <br>
```js
   //Here is an example of how to check virtual or actual device
    $rootScope.CheckIsVirtual = function () {
        blnVirtualflg = new Boolean;   //Environmental flag (you can modify this kind of codes)
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            if (device.isVirtual === undefined) {
                blnVirtualflg = true;    //Debug
                return ;
            }
            else {
                blnVirtualflg = false;   //Actual device
                return ;
            }
        }
    }
```
```js
//Here is a simle way to utilize dbcopy
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
    //you can change db name.
        window.plugins.sqlDB.copy("XXX.db", 0, copysuccess, copyerror);
    }
```
```js
    $rootScope.DBopen = function () {
        
        $rootScope.CheckIsVirtual();  //Check environment

        db = new Object;

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            if (blnVirtualflg == true) {   //Debug->WebSQL
                // DB Open
                db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);  //WebSQL ver

            }
            else if (blnVirtualflg == false) { //Actual Device->SQLite
                db = window.sqlitePlugin.openDatabase({ name: "words.db", location: 'default' });   //sqlite ver

            }
            return 
        }
    }
```

#<b>important</b><br>
Since dbcopy() tries to copy brand-new db-file from your WWW/(folder), you should not create sqlite DB <font color="red"><b>before</b></font> dpcopy(); <br>
->If db exists, the following error will appear. <br>
->e.code = 516 (db exists) <br>
e.g., <br>
```js
    $scope.DBopen()  //create db instance<br> 
    db.transaction(function (tr) { <br>
       tr.executeSql("CREATE TABLE IF NOT EXISTS XXX (AAA TEXT NOT NULL, BBB, CCC)", [], function () {  }, sqlError); <br>
       }); <br>
```       


