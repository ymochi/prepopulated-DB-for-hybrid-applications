//Common functions are under app.js

.run(function ($rootScope) {

    //intNo=0:WebSQL
    //intNo=1:SQlite    
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

})
