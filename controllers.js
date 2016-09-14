angular.module('app.controllers', ['ionic'])
  
.controller('myEitagonCtrl', function ($scope, $ionicPopup, $timeout, $state, $cordovaSplashscreen) {

    //document.addEventListener("deviceready", onDeviceReady, false);
    //function onDeviceReady() {
    //    //navigator.splashscreen.show();

    //    //setTimeout(function () {
    //    //    navigator.splashscreen.hide();
    //    //}, 1000);
    //    $cordovaSplashscreen.show();
    //    setTimeout(function () {
    //        $cordovaSplashscreen.hide();
    //    }, 1000);

    //}


    $scope.$on('$ionicView.loaded', function () {
        ionic.Platform.ready(function () {
            if (navigator && navigator.splashscreen) navigator.splashscreen.hide();
        });
    });



    blnLicense_flg = false;
    var intRet;


    //使用許諾などのチェックをする
    $scope.$on('$ionicView.enter', function () {
        //ndow.onload = function () {

            // DBを開く（使用許諾については★WebSQLを使用する（まだSQliteが使用可能かわからないため））
            db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);
  
            // テーブルを作成(License)
            db.transaction(function (tr) {
                tr.executeSql("CREATE TABLE IF NOT EXISTS License (License_flg BOOLEAN NOT NULL)", [], function () { console.log("License Create OK"); }, sqlError);
            });

            //DBへの問い合わせ
            db.transaction(function (tr) {
                tr.executeSql(
                  "SELECT * FROM License where rowid = 1", [],
                  showItemsOnResultSyncRev,
                  $scope.sqlError);
            });

            showItemsOnResultSyncRev = function (rt, rs) {
                //ライセンスの使用許諾の有無がまだ存在しない場合
                if (rs.rows.length == 0) {
                    //ライセンスの許諾の有無を聞く
                    location.href = '#/page1/page10'

                }

            };
            //エラー時の動作
            function sqlError(tr, e) {
            }


        ////DBオープン
        //    $scope.DBopen() //開発・実機共通
        //// テーブルを作成(m_words)
        //    db.transaction(function (tr) {
        //        //tr.executeSql(strsql, function () { showItems(); }, sqlError);
        //        tr.executeSql("CREATE TABLE IF NOT EXISTS m_words (word TEXT NOT NULL, form, meaning)", [], function () {  }, sqlError);
        //    });

        //// テーブルを作成(m_word_questions)
        //    db.transaction(function (tr) {
        //        //tr.executeSql(strsql, function () { showItems(); }, sqlError);
        //        tr.executeSql("CREATE TABLE IF NOT EXISTS m_word_questions ( word, source, sentence, correctAns, otherAns1, otherAns2, otherAns3, Japanese, Point)", [], function () {  }, sqlError);
        //    });

        //// テーブルを作成(m_word_family)
        //    db.transaction(function (tr) {
        //        tr.executeSql("CREATE TABLE IF NOT EXISTS m_word_family ( word TEXT NOT NULL, word_family)", [], function () {  }, sqlError);
        //    });

        //// テーブルを作成(t_Users_Words)
        //    db.transaction(function (tr) {
        //        tr.executeSql("CREATE TABLE IF NOT EXISTS T_Users_Words ( word TEXT NOT NULL, form, OK INTEGER, NG INTEGER, access DATE)", [], function () { }, sqlError);
        //    });



            
    });


})

.controller('cartTabDefaultPageCtrl', function ($scope) {
    $scope.onFileInput1 = function () {

        var item = document.getElementById('file_api_input1').files[0];
       // alert("name:" + item.name + " type:" + item.type + " size:" + item.size);

    }

    $scope.onFileInput2=function() {

        var item = document.getElementById('file_api_input2').files[0];

        var info = "name:" + item.name + " type:" + item.type + " size:" + item.size;

        document.getElementById('input_file_info').innerHTML = info;

        $scope.CreateOpenDB();

        //FileReaderのreadAsTextの形で読み取る
        var fr = new FileReader();

        //「e」となっているのはfr.readAsText(item)がすべて終了したのちの
        //イベント結果をもって返ってくるとの意味
        //JavaScriptは上から処理されていてもたまに非同期処理が入り、順序が逆転する
        fr.onload = function (e) {
            obj = angular.fromJson(e.target.result);
            for (var i = 0; i < obj.length; i++) {
                addItem(i);
            }
        }; 
        fr.readAsText(item);
        

    }
    
    // アイテムを追加 ----(*3)
    addItem = function (i) {
        var sqlpattern;

        sqlpattern = 4;

        switch (sqlpattern) {
            case 1: //m_docsentence
                var _word, _Sentence_No, _Sentence, _Fname, _Qno;
                _word = obj[i].word;
                _Sentence_No = obj[i].Sentence_No;
                _Sentence = obj[i].Sentence;
                _Fname = obj[i].Fname;
                _Qno = obj[i].Qno;

                strsql = "INSERT INTO m_docSentence VALUES (?, ?, ?, ? ,?) "
                db.transaction(function (tr) {
                    tr.executeSql(strsql, [_word, _Sentence_No, _Sentence, _Fname, _Qno],
                      function () { console.log("m_sentenceOK"); },
                      $scope.sqlError);
                });
                break;
            case 2://t_Users_Words
                var _uid, _word, _form, _OK, _notYet, _NG, _access;
                _uid = obj[i].uid;
                _word = obj[i].word;
                _form = obj[i].form;
                _OK = obj[i].OK;
                _notYet = obj[i].notYet;
                _NG = obj[i].NG;
                _access = obj[i].access;

                strsql = "INSERT INTO t_Users_Words VALUES (?, ?, ? ,?, ?, ?, ?) "
                db.transaction(function (tr) {
                    tr.executeSql(strsql, [_uid, _word, _form, _OK, _notYet, _NG, _access],
                      function () { console.log("t_Users_WordsINSERT OK"); },
                      $scope.sqlError);
                });
                break;

            case 3: //m_similar
                var _word, _form;
                var _simiword=[];
                _word = obj[i].word;
                _form = "not yet";
                _simiword[1] = obj[i].no1;
                _simiword[2] = obj[i].no2;
                _simiword[3] = obj[i].no3;
                _simiword[4] = obj[i].no4;
                _simiword[5] = obj[i].no5;
                _simiword[6] = obj[i].no6;
                _simiword[6] = obj[i].no7;
                _simiword[8] = obj[i].no8;
                _simiword[9] = obj[i].no9;
                _simiword[10] = obj[i].no10;
                _simiword[11]= obj[i].no11;
                _simiword[12]= obj[i].no12;
                _simiword[13]= obj[i].no13;
                _simiword[14]= obj[i].no14;
                _simiword[15]= obj[i].no15;
                _simiword[16]= obj[i].no16;
                _simiword[17] = obj[i].no17;
                _simiword[18] = obj[i].no18;
                _simiword[19] = obj[i].no19;
                _simiword[20] = obj[i].no20;

                
                for (j = 1; j <= 20; j++) {
                    //なぜか関数を分離してループさせるとうまくSQLが処理され、データが投入される
                    //このforの中で db.transactionを実施させると同じデータが書き込まれたりする（謎）
                   insert_m_similar(_word, _form, _simiword[j])
                }

                break;

            case 4://m_word_questions
                var _word, _source, _sentence, _correctAns, _otherAns1, _otherAns2, _otherAns3, _Japanese, _Point;
                _word = obj[i].word;
                _sentence = obj[i].sentence;
                _source = obj[i].source;
                _correctAns = obj[i].correctAns;
                _otherAns1 = obj[i].otherAns1;
                _otherAns2 = obj[i].otherAns2;
                _otherAns3 = obj[i].otherAns3;
                _Japanese = obj[i].Japanese;
                _Point = obj[i].Point;

                strsql = "INSERT INTO m_word_questions VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?) "
                db.transaction(function (tr) {
                    tr.executeSql(strsql, [_word, _source, _sentence, _correctAns, _otherAns1, _otherAns2, _otherAns3, _Japanese, _Point],
                      function () { console.log("m_word_questions INSERT OK"); },
                      $scope.sqlError);
                });
                break;

            case 5://m_word_derivatives
                var _word, deri_word, _form;
                _word = obj[i].word;
                _derived = obj[i].derived;
                _form = obj[i].form;

                db_insert(_word, _derived, _form);              

                break;

            case 6://m_words
                var _word, _form, _meaning;
                _word = obj[i].word;
                _form = obj[i].form;
                _meaning = obj[i].meaning;

                db_insert_m_words(_word, _form, _meaning)

                break;

            case 7://m_word_family
                var _word, _word_family;
                _word = obj[i].word;
                _word_family = obj[i].word_family;

                db_insert_m_word_family(_word, _word_family)

                break;

                
            default:
                alert("ごめんなさい！");
                break;
        }
          
    }

    var insert_m_similar = function (word, form, simiword) {
        strsql = "INSERT INTO m_similar VALUES (?, ?, ?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [word, form, simiword],
              function () { console.log("m_similar Insert OK"); },
              $scope.sqlError);
        });
}

    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert = function (word, derived, form) {
        strsql = "INSERT INTO m_word_derivatives VALUES (?, ?, ?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [word, derived, form],
              function () { console.log("m_word_derivatives INSERT OK"); },
              $scope.sqlError);
        });
    }

    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert_m_words = function (word, form, meaning) {
        strsql = "INSERT INTO m_words VALUES (?, ?, ?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [word, form, meaning],
              function () { console.log("m_words OK"); },
              $scope.sqlError);
        });
    }

    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert_m_word_family = function (word, word_family) {
        strsql = "INSERT INTO m_word_family VALUES (?, ?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [word, word_family],
              function () { console.log("m_word_family OK"); },
              $scope.sqlError);
        });
    }





    
})

.controller('page4Ctrl', function ($scope, $timeout) {


    $scope.audio_play =function() {
        audio2.play();
    }




    $scope.data = { 'CorrectPercent': '50' };

    var timeoutId = null;

    $scope.$watch('data.CorrectPercent', function () {


        console.log('Has changed');

        if (timeoutId !== null) {
            console.log('Ignoring this movement');
            return;
        }

        console.log('Not going to ignore this one');
        timeoutId = $timeout(function () {

            console.log('It changed recently!');

            $timeout.cancel(timeoutId);
            timeoutId = null;

            // Now load data from server 
        }, 1000);


    });



})

.controller('studyCtrl', function ($scope, $ionicPopup, $timeout, $state, $interval, $cordovaSQLite) {


    //ここから新たに始める

    //問題順序をランダムにするための配列
    var arryrandQ = new Array();


    //データ取得関数(同期的に行っていく）
    var getWordsSyncRev = function () {

        getWordsfromDBSyncRev(); //javascriptの場合"()"までつけないと実行してくれない！（不便！）

        //位置を記録
        var intposition;

        intposition = Number(intStaticQuestionStartNo);
        if (blnReviewflg == false && blnRealExamflg == false) {//通常の場合
            $scope.keepMyProgress(arryshuffle_number, intposition)  //通常の場合
        }
        else if (blnRealExamflg == true) {  //入試の場合
            $scope.keepMyProgressForRealExam(intposition);
        }


    }

    
    //データ取得関数(入試問題モードもまずはこちら）
    var getWordsfromDBSyncRev = function () {

        //各種初期化
        document.getElementById("word_meaning").innerHTML = "";  //初期化
        document.getElementById("formRev").innerHTML = "";  //初期化
        document.getElementById("word_family").innerHTML = "";//初期化
        document.getElementById("details").className = "yes-padding ng-hide";//初期化
        blnSoundOnflg = false; //音声再生かいなかのフラグも初期化（こうしないと一発目でdefineなしでエラーとなってしまう）
        document.getElementById("myPercent").innerHTML = "";    //正答率も初期化
        document.getElementById("myResults").innerHTML = "－－－－－";    //過去の正答誤答も初期化
        document.getElementById("intCnt").innerHTML = 0; //クリックカウント情報も初期化
        document.getElementById("word_meaningA").className = "my-fontno_small ng-hide"; //word_meaningのエリアも初期化
        document.getElementById("word_meaningB").className = "my-fontno_small ng-hide";
        document.getElementById("word_meaningC").className = "my-fontno_small ng-hide";
        document.getElementById("word_meaningD").className = "my-fontno_small ng-hide";
        document.getElementById("searchNo").className = "list list-inset my-margin ng-hide"

        itemClass ="item-icon-left item-text-wrap my-item"  //行のアイテムのクラス（ng-classで動的に変更させる）

        //行の高さの設定
        $scope.classA = itemClass;
        $scope.classB = itemClass;
        $scope.classC = itemClass;
        $scope.classD = itemClass;

        //問題の保持、シャッフル等
        //var intOrderNo = document.getElementById("question_order").innerHTML;
        var intOrderNo = intStaticQuestionStartNo;
        

        if (intOrderNo == "" || intOrderNo == null) {  //初回アクセスの場合
            intOrderNo = 1;  //データが存在しないときは1にする
            document.getElementById("question_order").innerHTML = 1;
        }

        //復習モード時の処理
        if (blnReviewflg == true) {
            getResultsForReview();

            return; //おしまい
        }

        //状況の進行を表示
        if (blnRealExamflg == false) {
            document.getElementById("progress").innerHTML = "[" + (Number(intOrderNo)) + "/" + arryshuffle_number.length + "]";
        }
        else {//入試問題モードの場合
            document.getElementById("progress").innerHTML = "[" + (Number(intOrderNo)) + "/" + arryshuffle_numberforRealExam.length + "]";
            arryshuffle_number = new Array();   //arryshuffle_numberの配列を利用（枠だけを借りる）
            arryshuffle_number = [];   //初期化
            arryshuffle_number = arryshuffle_numberforRealExam; //配列の移し替え

            //配列の端まで行ったら1を引いた数を設定する
            if (intOrderNo >= arryshuffle_numberforRealExam.length) {
                intOrderNo = arryshuffle_numberforRealExam.length - 1;
            }

        }

        //デバッグ用（今回は183に）
        //intOrderNo=399
        //DBオープン
        $scope.DBopen() //開発・実機共通
//        db_main = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM m_word_questions where rowid = " + arryshuffle_number[intOrderNo - 1], [],
         //       "SELECT * FROM m_word_questions where rowid = " + intOrderNo, [],
              showItemsOnResultSyncRev,
              $scope.sqlError);
        });

        
    }

    
    //結果表示（非同期なのでこいつは遅れて処理される）
    //★この関数は学習用も復習用も共通
    showItemsOnResultSyncRev = function (rt, rs) {

        var html = "";
        var originalForm = new Array;
        var strlen;
        //データ初期化
        document.getElementById("word_meaningA").innerHTML = "";
        document.getElementById("word_meaningB").innerHTML = "";
        document.getElementById("word_meaningC").innerHTML = "";
        document.getElementById("word_meaningD").innerHTML = "";

        document.getElementById("originalFormA").innerHTML = "";
        document.getElementById("originalFormB").innerHTML = "";
        document.getElementById("originalFormC").innerHTML = "";
        document.getElementById("originalFormD").innerHTML = "";

        document.getElementById("word_familyA").innerHTML = "";
        document.getElementById("word_familyB").innerHTML = "";
        document.getElementById("word_familyC").innerHTML = "";
        document.getElementById("word_familyD").innerHTML = "";

        document.getElementById("formA").innerHTML = "";
        document.getElementById("formB").innerHTML = "";
        document.getElementById("formC").innerHTML = "";
        document.getElementById("formD").innerHTML = "";

        document.getElementById("word_family").innerHTML = "";
        

        var row = rs.rows.item(0);
        arryrandQ = [row.correctAns, row.otherAns1, row.otherAns2, row.otherAns3];
        shuffle(arryrandQ);

        //配列に結果を投入
            document.getElementById("quetion").innerHTML = row.sentence;
            document.getElementById("source").innerHTML = row.source;


        //データの投入
            for (var i = 1; i <= 4; i++) {
                var intArryNo = i - 1;  //配列操作用
            switch (i) {
                case 1://A
                    strAnsID = "A";
                    strIconID = "icon1";
                    strOriginalForm = "originalFormA"
                    strwordmeaning = "word_meaningA"
                    strItemID = "itemA";
                    break;
                case 2://B
                    strAnsID = "B";
                    strIconID = "icon2";
                    strOriginalForm = "originalFormB"
                    strwordmeaning = "word_meaningB"
                    strItemID = "itemB";
                    break;
                case 3: //C
                    strAnsID = "C";
                    strIconID = "icon3";
                    strOriginalForm = "originalFormC"
                    strwordmeaning = "word_meaningC"
                    strItemID = "itemC";
                    break;
                case 4: //D
                    strAnsID = "D";
                    strIconID = "icon4";
                    strOriginalForm = "originalFormD"
                    strwordmeaning = "word_meaningD"
                    strItemID = "itemD";
                    break;
            }

            //「patients (patient:患者)」のようにデータが入っているものあるのでまず分離
            //consisted (consist of A: Aから成る、構成される) (consist)のようなものは後ろの括弧内をOriginalFormとする
            strwordSplited = new Array();
            strwordSplited = arryrandQ[intArryNo].split("　");   //全角スペースで分割

            document.getElementById(strAnsID).innerHTML = strwordSplited[0];
            //単語をほりこむ（原形でない場合は以下のif文で上書きされる
            document.getElementById(strOriginalForm).innerHTML = strwordSplited[0].toLowerCase();   //小文字に統一

            if (strwordSplited.length > 1) {
                document.getElementById(strwordmeaning).innerHTML =  strwordSplited[1];
                showMeaning(false, 1);    //隠す
                //単語の原形を入れる
                if (strwordSplited[2] === undefined) { //通常のパターン(patient:患者)のような場合
                    originalForm = strwordSplited[1].split(":");
                    document.getElementById(strOriginalForm).innerHTML = originalForm[0].substr(1, originalForm[0].length).toLowerCase();   //小文字に統一;
                }
                else {  //「(consist of A: Aから成る、構成される)」のような場合
                    strlen = strwordSplited[2].length;
                    originalForm = strwordSplited[2];
                    document.getElementById(strOriginalForm).innerHTML = originalForm.toLowerCase(); //小文字に統一
                }
            }

        }


            //その他全体的な答えとか
            document.getElementById("answer").innerHTML = row.word;
            document.getElementById("Jtranslated").innerHTML = row.Japanese;
            //document.getElementById("Point").innerHTML = row.Point;

        //大事な部分の文字色変更
        // 全てのspanタグを取得
        //pタグの中で「span」タグがあるもののみを対象とする
        //("ion-content")[1]としているのはstudy.htmlの中で<span>と書かれているもののみを対象とするためである
        //("ion-content")[0]ではなく("ion-content")[1]なのは、IONICが表示画面に前ページの情報をHTMLとして保持していたため
            var elements = document.getElementsByTagName("ion-content")[1].getElementsByTagName("span");

        // 取得した要素の色を赤にする (最初の要素から順に処理)
            for (var i = 0, intlen = elements.length; intlen > i; i++) {
                var element = elements[i];
                element.style.color = "red";
                element.style.fontWeight = "bold";
            }


        //正解の原形を取得し設定（小文字にする）
            document.getElementById("correctAns").innerHTML = getOriginalForm(row.correctAns).toLowerCase();


        //ここでform取得のためDBにアクセス(今回の主単語用）
            showmeaningRev(row.word);

        //主単語のword_family（派生語や類義語、反対語）を取得
            show_word_family(row.word);

        //過去の正答率を取得（復習モード以外）
            if (blnReviewflg == false) {
                showResults(row.word);
            }

        bln_finishflg = true;   //完了したことを示す
        //確実に一つ目のSQLが完了したことを確認して、次の処理に入る

    }


    //showmeaning() formを出力する関数   
    var showmeaningRev = function (strword) {

        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT word, form, meaning FROM m_words where word Like '" + strword + "'", [],
              showItemsOnPage,
              $scope.sqlError);
        });
    }

    //結果表示
    showItemsOnPage = function (rt, rs) {
        var html = "";
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var strword = row.meaning;
            var strform = row.form;
            //document.getElementById("word_meaning").innerHTML = strword;
            document.getElementById("formRev").innerHTML =  strform ;
            
        }
    }

    //show_word_family()（派生語や類義語、反対語）を取得   
    var show_word_family = function (strword) {

        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT word, word_family FROM m_word_family where word ='" + strword + "'", [],
              showItemsOnPageWordFamily,
              $scope.sqlError);
        });
    }

    //結果表示(word_family用）
    showItemsOnPageWordFamily = function (rt, rs) {
        var html = "";
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var strword = row.word_family;
            document.getElementById("word_family").innerHTML =  document.getElementById("word_family").innerHTML +"\n" +strword;
        }
    }

    //結果取得（単語一覧：「start」ではじめた場合もまずはこちらを通り、正答率を取得するようにする）
    var showResults = function (strword) {
            //この単語を元にOK/NGの結果を取得（呼び込む関数は別にする）
            getResultsEachWordForALL(strword);
    }

    var getResultsEachWordForALL = function (strword) {

        //DBオープン
        //db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);
        $scope.DBopen();

        //取得した一覧についてOK or NGを取得（10件限定）
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM T_Users_Words WHERE T_Users_Words.word ='" + strword + "' ORDER BY access DESC LIMIT 10", [],
              showItemsEachWordForALL,
              $scope.sqlError);
        });
    };


    //結果取得（単語毎）
    var showItemsEachWordForALL = function (rt, rs) {
        var strword;
        var intCnt
        var intOKCnt = 0;
        var intNGCnt = 0;
        var lngOKPercent = 0;
        var intQuestionNo;
        var strResultsHistory;

        //履歴の初期化
        strResultsHistory = "";

        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            strword = row.word;


            intOKCnt = intOKCnt + (typeof row.OK === "undefined" ? 0 : row.OK);
            intNGCnt = intNGCnt + (typeof row.NG === "undefined" ? 0 : row.NG);

            //過去の履歴を○×で管理
            if (row.OK > 0) {
                strResultsHistory = strResultsHistory + "○"
            }
            else if (row.NG >0 ) {
                strResultsHistory = strResultsHistory + "×"
            }
        }

        strResultsHistory = strResultsHistory + "－－－－－－";


        //過去の履歴の設定
        document.getElementById("myResults").innerHTML = "履歴" + strResultsHistory.substr(0, 6);    //履歴は6文字目まで取得（「－－－」を削っている）

        if (intOKCnt + intNGCnt>0){ //履歴がある場合のみ出力
            lngOKPercent = (intOKCnt / (intOKCnt + intNGCnt)) * 100;
            lngOKPercent = lngOKPercent.toFixed(1);

            //正答率の設定★（この時点で既に分かっているので入れておく）
            //正答率は当面表示せず、履歴の背景色を変えることにする
            //document.getElementById("myPercent").innerHTML = "";
            document.getElementById("myPercent").innerHTML = "過去正答" + lngOKPercent + "％";
            //75以上は青
            if (lngOKPercent >= 75) {
                document.getElementById("myPercent").className = "my-stressedfont badge badge-calm my-left-badge ng-hide";
                document.getElementById("myResults").className = "my-stressedfont badge badge-calm my-left-badge my-badge-margin";
            }
                //50～75未満までは緑
            else if (lngOKPercent >= 50 && lngOKPercent < 75) {
                document.getElementById("myPercent").className = "my-stressedfont badge badge-balanced my-left-badge ng-hide";
                document.getElementById("myResults").className = "my-stressedfont badge badge-balanced my-left-badge my-badge-margin";
            }
                //25～50未満は黄色
            else if (lngOKPercent >= 25 && lngOKPercent < 50) {
                document.getElementById("myPercent").className = "my-stressedfont badge badge-energized my-left-badge ng-hide";
                document.getElementById("myResults").className = "my-stressedfont badge badge-energized my-left-badge my-badge-margin";
            }
                //0～25未満は赤色
            else if (lngOKPercent > 0 && lngOKPercent < 25) {
                document.getElementById("myPercent").className = "my-stressedfont badge badge-assertive my-left-badge ng-hide";
                document.getElementById("myResults").className = "my-stressedfont badge badge-assertive my-left-badge my-badge-margin";
            }
                //0は紫色
            else if (lngOKPercent == 0) {
                document.getElementById("myPercent").className = "my-stressedfont badge badge-royal my-left-badge ng-hide";
                document.getElementById("myResults").className = "my-stressedfont badge badge-royal my-left-badge my-badge-margin";
            }

        }
        else {
            document.getElementById("myPercent").className = "my-stressedfont badge badge-calm my-left-badge ng-hide"
            //document.getElementById("myPercent").innerHTML = "はじめて";
            document.getElementById("myResults").innerHTML = "はじめて";
            document.getElementById("myResults").className = "my-stressedfont badge badge-calm my-left-badge my-badge-margin";
        }
        
    }
    

    //★★クリック時の動作
    //showmeaningOtherAns()他の単語の意味のみを出力する関数    
    $scope.showmeaningOtherAns = function (int_no) {
        var strword;
        var strwordmeaning;
        var strAnsId;
        var strcorrectAns;
        var strformID;

        //音声のみクリックだったときは何もせずにおしまい
        if (blnSoundOnflg == true) {
            blnSoundOnflg = false;
            return;
        }

        
        //初回かどうかのカウント用のデータ設定
        document.getElementById("intCnt").innerHTML = Number(document.getElementById("intCnt").innerHTML) + 1;

        //まずint_noからどこの問題文か、どの単語かを抽出
        switch (int_no) {
            case 1:
                //データが既に存在する場合はからっぽにして終わらせる
                if (AlreadyItemShown(1) == true) {
                    return;
                };

                strword = document.getElementById("originalFormA").innerHTML;
                strwordmeaning = document.getElementById("word_meaningA").innerHTML;
                showMeaning(true,1);
                check_ans(1);
                strAnsId = "word_familyA";
                strformID = "formA";
                break;
            case 2:
                //データが既に存在する場合はからっぽにして終わらせる
                if (AlreadyItemShown(2) == true) {
                    return;
                };
                strword = document.getElementById("originalFormB").innerHTML;
                strwordmeaning = document.getElementById("word_meaningB").innerHTML;
                showMeaning(true,2);
                check_ans(2);
                strAnsId = "word_familyB";
                strformID = "formB";
                break;
            case 3:
                //データが既に存在する場合はからっぽにして終わらせる
                if (AlreadyItemShown(3) == true) {
                    return;
                };
                strword = document.getElementById("originalFormC").innerHTML;
                strwordmeaning = document.getElementById("word_meaningC").innerHTML;
                showMeaning(true,3);
                check_ans(3);
                strAnsId = "word_familyC";
                strformID = "formC";
                break;
            case 4:
                //データが既に存在する場合はからっぽにして終わらせる
                if (AlreadyItemShown(4) == true) {
                    return;
                };
                strword = document.getElementById("originalFormD").innerHTML;
                strwordmeaning = document.getElementById("word_meaningD").innerHTML;
                showMeaning(true,4);
                check_ans(4);
                strAnsId = "word_familyD";
                strformID = "formD"
                break;
        }

        //(動)、(形)等を表示する
        document.getElementById(strformID).className = "my-fontno_small ng-show";   
        
        //意味が載っていないようなら検索する
        if (strwordmeaning == "") {
            // $scope.CreateOpenDB();
            //この形で行わないと、もう一度DBがCreateされ、前後でInsertした処理がすべて消えてしまう
            $scope.DBopen();
           // db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);
            
            //データ取得
            db.transaction(function (tr) {
                tr.executeSql(
                  "SELECT word, form, meaning FROM m_words where word LIKE '" + strword + "'", [],
                  showItemsOnPageOthers,
                  $scope.sqlError);
            });
        }


        if (document.getElementById(strAnsId).innerHTML == "") {
            //関連語を出力させる

            $scope.DBopen();
       //     db2 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);
            db.transaction(function (tr) {
                tr.executeSql(
                  "SELECT word, word_family FROM m_word_family where word ='" + strword + "'", [],
                  showItemsOnPageWordFamilyEach,
                  $scope.sqlError);
            });
        }

        //クリック後の結果を表示させる（○×等）

        strcorrectAns = document.getElementById("correctAns").innerHTML;    //正解データ

        //初回の場合はデータを更新
        if (Number(document.getElementById("intCnt").innerHTML)==1){
            getResultsEachWordForALL(strcorrectAns);    //正答率や履歴データ等を取得（データの検索は問題文を代表しているstrcorrectAnsを使う）
        }

    }

    //結果表示
    showItemsOnPageOthers = function (rt, rs) {
        var html = "";
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var strword = row.word;
            var strmeaning = row.meaning;
            var strform = row.form;
            var strwordA, strwordB, strwordC, strwordD;

            strwordA = document.getElementById("originalFormA").innerHTML;
            strwordB = document.getElementById("originalFormB").innerHTML;
            strwordC = document.getElementById("originalFormC").innerHTML;
            strwordD = document.getElementById("originalFormD").innerHTML;
            
            switch (strword){
                case strwordA:
                    document.getElementById("word_meaningA").innerHTML = strmeaning;
                    document.getElementById("formA").innerHTML = "<br>" + strform;  //改行を入れる
                    break;
                case strwordB:
                    document.getElementById("word_meaningB").innerHTML = strmeaning;
                    document.getElementById("formB").innerHTML = "<br>" + strform;
                    break;
                case strwordC:
                    document.getElementById("word_meaningC").innerHTML = strmeaning;
                    document.getElementById("formC").innerHTML = "<br>" + strform;
                    break;
                case strwordD:
                    document.getElementById("word_meaningD").innerHTML = strmeaning;
                    document.getElementById("formD").innerHTML = "<br>" + strform;
                    break;
            }
        }

        //色替え
        changeColor();

    }


    
    //結果表示(word_family用（各リスト、クリック時の動作））
    showItemsOnPageWordFamilyEach = function (rt, rs) {
        var html = "";

        strwordA = document.getElementById("originalFormA").innerHTML;
        strwordB = document.getElementById("originalFormB").innerHTML;
        strwordC = document.getElementById("originalFormC").innerHTML;
        strwordD = document.getElementById("originalFormD").innerHTML;

        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var strword = row.word;
            var strword_family =row.word_family;

            switch (strword){
                case strwordA:
                    document.getElementById("word_familyA").innerHTML = document.getElementById("word_familyA").innerHTML +"\n" + "■"+ strword_family;
                    break;
                case strwordB:
                    document.getElementById("word_familyB").innerHTML = document.getElementById("word_familyB").innerHTML + "\n" + "■" + strword_family;
                    break;
                case strwordC:
                    document.getElementById("word_familyC").innerHTML = document.getElementById("word_familyC").innerHTML + "\n" + "■" + strword_family;
                    break;
                case strwordD:
                    document.getElementById("word_familyD").innerHTML = document.getElementById("word_familyD").innerHTML + "\n" + "■" + strword_family;
                    break;
            }        


            //document.getElementById("word_family").innerHTML = document.getElementById("word_family").innerHTML + "\n" + strword;
        }

        //色替え
        changeColor();
    }



    //クリック時の動作を決める
    var check_ans = function (intSelectedNo) {
        var strword;
        var strwordOriginalForm;
        var strAnsID;   //クリックされた答え
        var strIconID;  //アイコンのID
        var strOriginalForm;    //クリックされた答えの原形
        var strItemID;
        strcorrectAns = document.getElementById("correctAns").innerHTML;

        var intclickCount;  //クリックカウント
        intclickCount = Number(document.getElementById("intCnt").innerHTML);
        
        switch (intSelectedNo) {
            case 1://A
                strAnsID = "A";
                strIconID = "icon1";
                strOriginalForm = "originalFormA"
                strItemID = "itemA";
                break;
            case 2://B
                strAnsID = "B";
                strIconID = "icon2";
                strOriginalForm = "originalFormB"
                strItemID = "itemB";
                break;
            case 3: //C
                strAnsID = "C";
                strIconID = "icon3";
                strOriginalForm = "originalFormC"
                strItemID = "itemC";
                break;
            case 4: //D
                strAnsID = "D";
                strIconID = "icon4";
                strOriginalForm = "originalFormD"
                strItemID = "itemD";
                break;
        }


        //OKだったらハッピーアイコン、また、DBに登録
        strword = getWordfromWeb(strAnsID);

        if (document.getElementById(strOriginalForm).innerHTML == strcorrectAns) {
            if (intclickCount == 1) {//初回の場合
                addItemToUsersWordsRev(strword, 0);//正解で登録
            }
            //アイコン設定
            document.getElementById(strIconID).className = "icon ion-happy-outline no-padding";

        }
        else {
            //アイコンがまだない状態のものは不正解として登録
            if (AnsOpenedCheck() == 0 && NGOpenedCheck() ==0) {
                addItemToUsersWordsRev(strcorrectAns, 1);//不正解で登録
            }
            //アイコン設定
            document.getElementById(strIconID).className = "icon ion-sad no-padding";

        }
                

    };

    //解答が既にオープンになっているか否かのチェック（iconの「happy」の有無でチェック）
    var AnsOpenedCheck = function () {
        if (document.getElementById("icon1").className.indexOf("happy", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon2").className.indexOf("happy", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon3").className.indexOf("happy", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon4").className.indexOf("happy", 0) > 0) {
            return 1;
        }
        else {
            return 0;   //オープンなし
        }
    }

    //NGが一度登録されているか否かのチェック（iconの「sad」の有無でチェック）
    var NGOpenedCheck = function () {
        if (document.getElementById("icon1").className.indexOf("sad", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon2").className.indexOf("sad", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon3").className.indexOf("sad", 0) > 0) {
            return 1;
        }
        else if (document.getElementById("icon4").className.indexOf("sad", 0) > 0) {
            return 1;
        }
        else {
            return 0;   //オープンなし
        }
    }

    //単語の原形をWeb上の情報から取得する関数
    var getWordfromWeb = function (strQno) {
        var strword;
        switch (strQno) {
            case "A":
                strword = document.getElementById("originalFormA").innerHTML;
                return strword;
                break;
            case "B":
                strword = document.getElementById("originalFormB").innerHTML;
                return strword;
                break;
            case "C":
                strword = document.getElementById("originalFormC").innerHTML;
                return strword;
                break;
            case "D":
                strword = document.getElementById("originalFormD").innerHTML;
                return strword;
                break;
        }
    }


    //解答を出す出さないの関数
    var showMeaning = function (blnMeaningflg, intNo) {
        switch (intNo) {
            case 1://A
                strAnsID = "word_meaningA";
                break;
            case 2://B
                strAnsID = "word_meaningB";
                break;
            case 3: //C
                strAnsID = "word_meaningC";
                break;
            case 4: //D
                strAnsID = "word_meaningD";
                break;
        }

        if (blnMeaningflg == false) {   //既に結果が表示されているものは一旦隠す
            document.getElementById(strAnsID).className = "my-fontno_small ng-hide";
        } else if (blnMeaningflg == true) {    //表示
            document.getElementById(strAnsID).className = "my-fontno_small ng-show";
        }

    }


    ////解答を出す出さないの関数A
    //var showMeaningA = function (blnMeaningflg) {
    //    if (blnMeaningflg == false) {   //既に結果が表示されているものは一旦隠す
    //        document.getElementById("word_meaningA").className = "my-fontno_small ng-hide";
    //     } else if (blnMeaningflg == true) {    //表示
    //        document.getElementById("word_meaningA").className = "my-fontno_small";
    //     }
    //}

    ////解答を出す出さないの関数B
    //var showMeaningB = function (blnMeaningflg) {
    //    if (blnMeaningflg == false) {   //既に結果が表示されているものは一旦隠す
    //        document.getElementById("word_meaningB").className = "my-fontno_small ng-hide";
    //    } else if (blnMeaningflg == true) {    //表示
    //        document.getElementById("word_meaningB").className = "my-fontno_small";
    //    }
    //}

    ////解答を出す出さないの関数C
    //var showMeaningC = function (blnMeaningflg) {
    //    if (blnMeaningflg == false) {   //既に結果が表示されているものは一旦隠す
    //        document.getElementById("word_meaningC").className = "my-fontno_small ng-hide";
    //    } else if (blnMeaningflg == true) {    //表示
    //        document.getElementById("word_meaningC").className = "my-fontno_small";
    //    }
    //}

    ////解答を出す出さないの関数D
    //var showMeaningD = function (blnMeaningflg) {
    //    if (blnMeaningflg == false) {   //既に結果が表示されているものは一旦隠す
    //        document.getElementById("word_meaningD").className = "my-fontno_small ng-hide";
    //    } else if (blnMeaningflg == true) {    //表示
    //        document.getElementById("word_meaningD").className = "my-fontno_small";
    //    }
    //}


    var getOriginalForm = function (strword) {
        //「patients (patient:患者)」のようにデータが入っているものあるのでまず分離
        var arrystrwordSplited = new Array();
        var arrystrOriginalForm = new Array();
        var arrystrwordSplited = strword.split("　");   //全角スペースで分割

        if (arrystrwordSplited.length > 1) {
            //単語の原形を入れる
            if (arrystrwordSplited[2] === undefined) { //通常のパターン(patient:患者)のような場合
                arrystrOriginalForm =arrystrwordSplited[1].split(":");
                originalForm = arrystrOriginalForm[0].substr(1, arrystrOriginalForm[0].length).toLowerCase();   //小文字に統一;
            }
            else {  //「(consist of A: Aから成る、構成される)　(consist)」のような場合

                originalForm = arrystrwordSplited[2];
            }
        }
        else {
            originalForm = arrystrwordSplited[0];
        }
        return originalForm;
    }

    //一度表示したアイテムの情報を見えなくする関数
    var AlreadyItemShown = function (intNo) {
        var strAnsID;
        var strformID;
        var strWordFamily;

        switch (intNo) {
            case 1://A
                strAnsID = "word_meaningA";
                strformID = "formA";
                strWordFamily = "word_familyA"
                break;
            case 2://B
                strAnsID = "word_meaningB";
                strformID = "formB";
                strWordFamily = "word_familyB"
                break;
            case 3: //C
                strAnsID = "word_meaningC";
                strformID = "formC";
                strWordFamily = "word_familyC"
                break;
            case 4: //D
                strAnsID = "word_meaningD";
                strformID = "formD";
                strWordFamily = "word_familyD"
                break;
        }

        //既に状態がhideでなかったらオープン状態と判定→データを隠す処理へ
        if (document.getElementById(strAnsID).className.indexOf("hide") < 0){   //hideがない場合
            showMeaning(false, intNo);  //意味を隠す
            document.getElementById(strformID).className = "my-fontno_small ng-hide";   //(動)、(形)等を隠す
            document.getElementById(strWordFamily).innerHTML = "";

            return true;    //オープン状態→データを隠す処理へ

        }
        else {
            return false;   //非オープン状態→オープン化の処理へ
        }
        
    }

    
    $scope.NextPrevPage = function (intNo) {
        //アイコンをまずなくす
        document.getElementById("icon1").className = "";
        document.getElementById("icon2").className = "";
        document.getElementById("icon3").className = "";
        document.getElementById("icon4").className = "";

        //データ初期化
        document.getElementById("word_meaningA").innerHTML = ""
        document.getElementById("word_meaningB").innerHTML = ""
        document.getElementById("word_meaningC").innerHTML = ""
        document.getElementById("word_meaningD").innerHTML = ""

        if (intNo == 1) {   //一つ足す（次ページのとき）
            //document.getElementById("question_order").innerHTML = Number(document.getElementById("question_order").innerHTML) + 1;
            //intOrderNo = Number(document.getElementById("question_order").innerHTML);

            //続けるか聞く
            if (Number(intStaticQuestionStartNo) % 10 == 0) {
                // $scope.showContinueOrNot()   →一旦停止
            }

            if (blnReviewflg == false) {
                //Maxは配列の最大数で
                if (Number(intStaticQuestionStartNo) < arryshuffle_number.length) {
                    intStaticQuestionStartNo = Number(intStaticQuestionStartNo) + 1;
                }
            }
            else {
                if (Number(intStaticQuestionStartNo) < arryshuffle_numberforReview.length) {
                    intStaticQuestionStartNo = Number(intStaticQuestionStartNo) + 1;
                }
            }
        } else if (intNo == -1) {  //一つ引く（前ページのとき）
            //if (document.getElementById("question_order").innerHTML != 1) {
            //    document.getElementById("question_order").innerHTML = Number(document.getElementById("question_order").innerHTML) - 1;
            //}
            if (Number(intStaticQuestionStartNo) != 1) {                
                intStaticQuestionStartNo = Number(intStaticQuestionStartNo) - 1;
            }
            else if (Number(intStaticQuestionStartNo) == 1) {
                $state.go('tabsController.myEitagon');  //初めのページに戻る
            }

        }

        //$scope.CreateOpenDB();
        getWordsSyncRev();
    };


    // A confirm dialog △にするか聞く
    $scope.showContinueOrNot = function () {
        var word = "registration";
        var sentence_example = "Register your Surface product for quicker access to technical support from Answer Desk, and to easily check the status of your warranty";

        var confirmPopup = $ionicPopup.confirm({
            title: "<style>.popup-title </style><p>このまま続けますか<p/>",
            template: "",
            okText: '終わる',
            cancelText: "続ける",
            buttons: [
                {//一つ目ボタン
                    text: 'やめる',
                    type: 'button-energized',
                    onTap: function (e) {
                        location.href = '#/page1/page2'
                         return '0';
                    }
                },
                {//二つ目ボタン
                    text: '続ける',
                    type: 'button-positive',
                    onTap: function (e) {
                        return '0';
                    }
                },
                {//三つ目ボタン
                    text: '<b>チェックテストへ</b>',
                    type: 'button-assertive',
                    onTap: function (e) {
                        location.href = '#/page1/page8'
                        return '2';
                    }
                }
                ]
        });
    }


    //t_Users_Wordsへのデータの登録
    var addItemToUsersWordsRev = function (strword, reg_no) {

        var  _word, _form, _OK, _notYet, _NG, _access;
        _word = strword;
        //若干文字列加工（括弧が邪魔なため）
        _form = document.getElementById("formRev").innerHTML;
      //  _form = _form.substr(1);  //先頭削除
      //  _form = _form.substr(0, _form.length - 1);//末尾削除

        //var intcorrects, intalldenominator; //HTML上に見えないけれども記載されている過去のOK/NG数を取得
        //intcorrects = Number(document.getElementById(int_itemno + "correctPoints").innerHTML);
        //intalldenominator = Number(document.getElementById(int_itemno + "alldenominator").innerHTML);

        //初期値
        _OK = 0, _NG = 0;
        switch (reg_no) {
            case 0://OK
                _OK = 1;
                //intcorrects = intcorrects + 1;
                break;
            case 1://NG
                _NG = 1;
                break;
        }

        //_access = new Date();
        //_access = _access.getFullYear() + "/" + _access.getMonth() + "/" + _access.getDate() + " " + _access.getHours() + ":" + _access.getMinutes() + ":" + _access.getSeconds();

        _access = yyyymmddhhmiss();
        
                
        //DBオープン(他のDB処理と混ざらない名前とした)
        // $scope.CreateOpenDB();
        $scope.DBopen();
       // db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

        strsql = "INSERT INTO T_Users_Words VALUES (?, ?, ?, ?, ?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [_word, _form, _OK, _NG, _access],
              function () {
                  //console.log("t_Users_Words Insert OK");
              },
              function () { $scope.sqlError });
        });

    }

    // 日付をYYYY/MM/DD HH:DD:MI:SS形式で取得
    var yyyymmddhhmiss = function () {
        var date = new Date();
        var yyyy = date.getFullYear();
        var mm = toDoubleDigits(date.getMonth() + 1);
        var dd = toDoubleDigits(date.getDate());
        var hh = toDoubleDigits(date.getHours());
        var mi = toDoubleDigits(date.getMinutes());
        var ss = toDoubleDigits(date.getSeconds());
        return yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;
    };

    var toDoubleDigits = function (num) {
        num += "";
        if (num.length === 1) {
            num = "0" + num;
        }
        return num;
    };


    //配列シャッフルの有名な関数（ Fisher–Yates shuffleというらしい）
    var shuffle = function (array) {
        var n = array.length, t, i;

        while (n) {
            i = Math.floor(Math.random() * n--);
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }

        return array;
    }


    //音声再生用
    $scope.audio_play = function (intSelectedNo) {
        var audio = new Audio();

        var strSource;
        var strOriginalForm;
        var strword;

        switch (intSelectedNo) {
            case 1://A
                strSource = "sound_sourceA";
                strOriginalForm ="originalFormA";
                break;
            case 2://B
                strSource = "sound_sourceB";
                strOriginalForm ="originalFormB";
                break;
            case 3: //C
                strSource = "sound_sourceC";
                strOriginalForm ="originalFormC";
                break;
            case 4: //D
                strSource = "sound_sourceD";
                strOriginalForm ="originalFormD";
                break;
        }

        // サウンドファイルまでの URL アドレスを指定
        //audio.src = "wav/register.wav";
        //audio.src = document.getElementById("wav_source").src


        strword = document.getElementById(strOriginalForm).innerHTML;
        document.getElementById(strSource).src = "mp3/" + strword + ".mp3";

        audio.src = document.getElementById(strSource).src
        //audio.play();

        //mediaを使った方法
        media = new Media(document.getElementById(strSource).src, onSuccess, onError);
        //Play the audio. You can set number of the replaying time here.
        media.play({ numberOfLoops: 1 });

        blnSoundOnflg = true;   //ただの音声再生とITEMのクリックの動作を分けるため
    }

  //  var test_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  //  shuffle(test_array);


    //A success callback function displaying a success message.
    function onSuccess() {
        //console.log("playAudio():Audio Success");
    }

    //A callback function in case of failure
    function onError(error) {
       // alert('code: ' + error.code + '\n' +  'message: ' + error.message + '\n');
    }


    //var startInterval = function () {
    //    if ($scope.stopinterval) {
    //        $interval.cancel($scope.stopinterval);
    //    }
    //    //インターバルを取得する関数
    //    $scope.stopinterval = $interval(function () {
    //        if (blnfinishforReviewflg == true) {
    //            $interval.cancel($scope.stopinterval);
    //            return;
    //        }
    //        console.log("interval")
    //    }, 100);
    //}


    //番号検索用
    $scope.searchNo = function () {

        if (document.getElementById("searchNo").className == "list list-inset my-margin ng-hide") {
            document.getElementById("searchNo").className = "list list-inset my-margin ng-show"

            $scope.somePlaceholder = "問題番号を入力して下さい";
        }
        else if(document.getElementById("searchNo").className == "list list-inset my-margin ng-show"){
            document.getElementById("searchNo").className = "list list-inset my-margin ng-hide"
        }

    }


    $scope.searchList = function () {
        //プレースホルダーからデータを取得
        var obj = document.getElementById("mySearch")
        var searchdata;
        searchdata = obj.value


        if (window.event.keyCode == 13) {   //リターンコードの場合
            if (searchdata == "") { //何もデータがなかったら現在のページにしておしまい
                searchdata = intStaticQuestionStartNo
            }
            if (isNaN(searchdata) == false) {   //文字かどうかのチェック（数値のチェック）
                PageJump(Number(searchdata));
                //データを消す
                document.getElementById("mySearch").value=""
                //隠す
                document.getElementById("searchNo").className = "list list-inset my-margin ng-hide"
            }
        }
        else if (window.event.keyCode == 8 && searchdata =="") {   //バックスペースの場合
            //隠す
            document.getElementById("searchNo").className = "list list-inset my-margin ng-hide"
        }
    }

    
    //ページジャンプ用（PrevNextと同じような処理）
    var PageJump = function (intNo) {
        var maxNumber;
        //アイコンをまずなくす
        document.getElementById("icon1").className = "";
        document.getElementById("icon2").className = "";
        document.getElementById("icon3").className = "";
        document.getElementById("icon4").className = "";

        //データ初期化
        document.getElementById("word_meaningA").innerHTML = ""
        document.getElementById("word_meaningB").innerHTML = ""
        document.getElementById("word_meaningC").innerHTML = ""
        document.getElementById("word_meaningD").innerHTML = ""

        if (blnReviewflg == false) {
            maxNumber = arryshuffle_number.length;   //通常の配列数

        }
        else {
            maxNumber = arryshuffle_numberforReview.length;  //復習の配列数
        }
        
        if (intNo >= 1 && intNo <= maxNumber) {   //範囲の中ならそのまま
            intStaticQuestionStartNo = Number(intNo) ;
        }
        else if (intNo <= 0) {
            intStaticQuestionStartNo = 1;
        }
        else if (intNo > maxNumber) {
            intStaticQuestionStartNo = maxNumber;
        }

        
        //$scope.CreateOpenDB();
        getWordsSyncRev();
    };

    //大事な部分の文字色変更(meaning用）
    // 全てのspanタグを取得
    //ion-itemタグの中で「span」タグがあるもののみを対象とする
    var changeColor = function () {
        var rootelements = document.getElementsByTagName("ion-item");
        for (var i = 0 ; i < rootelements.length; i++) {
            var elements = document.getElementsByTagName("ion-item")[i].getElementsByTagName("span");

            // 取得した要素の色を赤にする (最初の要素から順に処理)
            for (var j = 0, intlen = elements.length; intlen > j; j++) {
                var element = elements[j];
                element.style.color = "red";
                element.style.fontWeight = "bold";
            }
        }
    }


    //★画面をバイバイするときのイベントを補足する処理
    //$scope.$on('$ionicView.beforeLeave', function () {
    //    var intposition;

    //    intposition = Number(intStaticQuestionStartNo);
    //    // Anything you can think of
    //    //console.log('beforeunload')
        
    //    if (blnReviewflg == false && blnRealExamflg == false) {//通常の場合
    //        $scope.keepMyProgress(arryshuffle_number, intposition)
    //    }
    //});


    
    //★復習モード用の処理★
    //データ取得関連の処理（この位置に書いておかないと実行されない。Javascriptとは面倒なもの）
    var getResultsForReview = function () {

        //既に復習用の配列データがそろっているならすぐに問題実行
        if (blnReviewflg == true) {
            if (arryshuffle_numberforReview.length != 0) {
                //状況の進行を表示
                var intOrderNo = intStaticQuestionStartNo;
                document.getElementById("progress").innerHTML = "[" + (Number(intOrderNo)) + "/" + arryshuffle_numberforReview.length + "]";

                //正答率の設定★（この時点で既に分かっているので入れておく）
                document.getElementById("myPercent").innerHTML = "過去正答" + arryshuffle_numberforPercent[intOrderNo - 1] + "％";

                //DBオープン
                $scope.DBopen();
              //  db2 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                db.transaction(function (tr) {
                    tr.executeSql(
                      "SELECT * FROM m_word_questions where rowid = " + arryshuffle_numberforReview[intOrderNo - 1], [], //配列なので1引く
                 //       "SELECT * FROM m_word_questions where rowid = " + intOrderNo, [],
                      showItemsOnResultSyncRev,
                      $scope.sqlError);
                });
                return;
            }
        }
        

        //DBオープン
        $scope.DBopen();
      //  db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);


        //まずは一覧を取得(T_Users_Wordsとm_word_questionsで一致しているもののみを出力)
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT DISTINCT T_Users_Words.word, m_word_questions.rowid FROM T_Users_Words INNER JOIN m_word_questions ON T_Users_Words.word = m_word_questions.word WHERE T_Users_Words.word is NOT '' ORDER BY T_Users_Words.word ASC", [],
              showItemsOnResult,
              $scope.sqlError);
        });
    }

    //結果取得（単語一覧）
    var showItemsOnResult = function (rt, rs) {
        var strword;
        var introwid;
        aryyQuestionNoForReview = new Array;
        aryyWordForReview = new Array;
        intCntForReview = 0;

        //復習データが存在しなかった場合の処理
        if (rs.rows.length == 0 && blnReviewflg == true) {
            informNoReviewData();
            $state.go('tabsController.myEitagon');  //初めのページに戻る
            return;
        }

        //どの正答率以下の問題を出題するか設定
        if ($scope.getDataFromStrage(3)==null || $scope.getDataFromStrage(3)==""){
            intCorrectPercent=50;
        }
        else{
            intCorrectPercent = $scope.getDataFromStrage(3);    //閾値を取得
        }

        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            strword = row.word;
            introwid = row.rowid;

            //配列に情報を登録
            aryyWordForReview[i] = strword;
            aryyQuestionNoForReview[i] = introwid;

            //この単語を元にOK/NGの結果を取得（呼び込む関数は別にする）
            getResultsEachWord(strword);
        }
    }

    var getResultsEachWord = function (strword) {
        //取得した一覧についてOK or NGを取得（10件まで）
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM T_Users_Words WHERE T_Users_Words.word ='" + strword + "' ORDER BY access DESC LIMIT 10", [],
              showItemsEachWord,
              $scope.sqlError);
        });
    };

    //結果取得（単語毎）
    var showItemsEachWord = function (rt, rs) {
        var strword;
        var intCnt
        var intOKCnt = 0;
        var intNGCnt = 0;
        var lngOKPercent = 0;
        var strIcon;
        var intIndexno;
        var intQuestionNo;
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            strword = row.word;
            intOKCnt = intOKCnt + (typeof row.OK === "undefined" ? 0 : row.OK);
            intNGCnt = intNGCnt + (typeof row.NG === "undefined" ? 0 : row.NG);
        }
        lngOKPercent = (intOKCnt / (intOKCnt + intNGCnt)) * 100;
        lngOKPercent = lngOKPercent.toFixed(1);
              
        if (Number(lngOKPercent) <= Number(intCorrectPercent)) {

            intIndexno=aryyWordForReview.indexOf(strword);
            if (intIndexno >= 0) {
                intQuestionNo = aryyQuestionNoForReview[intIndexno];//該当問題の問題番号を取得
                arryshuffle_numberforReview.push(intQuestionNo);    //登録する
                arryshuffle_numberforPercent.push(Number(lngOKPercent)) //正答率を保存
            }            
        }

        
        intCntForReview = intCntForReview + 1;
       // if(intCntForReview= )

        //すべてのデータを処理＆閾値より下の復習用のデータが存在した場合
        if (intCntForReview == aryyWordForReview.length) {
            if (arryshuffle_numberforReview.length > 0) {
                //状況の進行を表示
                var intOrderNo = intStaticQuestionStartNo;
                document.getElementById("progress").innerHTML = "[" + (Number(intOrderNo)) + "/" + arryshuffle_numberforReview.length + "]";

                //正答率の設定★（この時点で既に分かっているので入れておく）
                document.getElementById("myPercent").innerHTML = "過去正答" + arryshuffle_numberforPercent[intOrderNo - 1] + "％";

                //75以上は青
                if (arryshuffle_numberforPercent[intOrderNo - 1] >= 75) {
                    document.getElementById("myPercent").className = "my-stressedfont badge badge-calm my-left-badge";
                }
                    //50～75未満までは緑
                else if (arryshuffle_numberforPercent[intOrderNo - 1] >= 50 && arryshuffle_numberforPercent[intOrderNo - 1] < 75) {
                    document.getElementById("myPercent").className = "my-stressedfont badge badge-balanced my-left-badge";
                }
                    //25～50未満は黄色
                else if (arryshuffle_numberforPercent[intOrderNo - 1] >= 25 && arryshuffle_numberforPercent[intOrderNo - 1] < 50) {
                    document.getElementById("myPercent").className = "my-stressedfont badge badge-energized my-left-badge";
                }
                    //0～25未満は赤色
                else if (arryshuffle_numberforPercent[intOrderNo - 1] > 0 && arryshuffle_numberforPercent[intOrderNo - 1] < 25) {
                    document.getElementById("myPercent").className = "my-stressedfont badge badge-assertive my-left-badge";
                }
                    //0は紫色
                else if (arryshuffle_numberforPercent[intOrderNo - 1] == 0) {
                    document.getElementById("myPercent").className = "my-stressedfont badge badge-royal my-left-badge";
                }


                //DBオープン
                $scope.DBopen();
            //    db2 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                db.transaction(function (tr) {
                    tr.executeSql(
                      "SELECT * FROM m_word_questions where rowid = " + arryshuffle_numberforReview[intOrderNo - 1], [],//配列なので-1してやる
                 //       "SELECT * FROM m_word_questions where rowid = " + intOrderNo, [],
                      showItemsOnResultSyncRev,
                      $scope.sqlError);
                });
            }
            if (arryshuffle_numberforReview.length == 0) {  //正解率の閾値にひっかかるデータが存在しなかった場合
                //メッセージを出力して終了
                informNoReviewData();
                $state.go('tabsController.myEitagon');  //初めのページに戻る
                return;
                
                }
        }
    }

    //復習データが存在しない場合のメッセージ
    var informNoReviewData = function () {
        var alertPopup = $ionicPopup.alert({
            title: "<style>.popup-title </style><p>お知らせ<p/>",
            template: "復習すべきデータがありません",
        })
    };

    

    //ランダムに取得した値を元に問題を抽出
    // $scope.CreateOpenDB();
    getWordsSyncRev();  //ここから開始


    //startボタンを押したときや復習レベルの設定を変更して戻ってきた場合の対応
    $scope.$on('$ionicView.enter', function (event, data) {

        //復習のレベル設定を変えていた場合はHOME画面に戻る
        if (blnChangePercentBorderLine == true) {
            location.href = '#/page1/page2'
            //$state.go('tabsController.myEitagon');  //初めのページに戻る
        }
        
    })





    //$scope.selectAll = function () {
    //    var query = "SELECT * FROM tst";
    //    $cordovaSQLite.execute(db, query, []).then(function (res) {
    //        alert("aaaaaaaaaaaaaa")
    //        if (res.rows.length > 0) {
    //            for (var i = 0; i < res.rows.length; i++) {
    //                console.log("SELECTED -> " + res.rows.item(i).word + " " + res.rows.item(i).sentence);
    //            }
    //        } else {
    //            console.log("No results found");
    //        }
    //    }, function (err) {
    //        console.error(err);
    //    });

        //$cordovaSQLite.execute(db2, query, []).then(function (res) {
        //    alert("bbbbbbbbbbbbbbbbbbbbbbbbbbb")
        //    if (res.rows.length > 0) {
        //        var newOptions = [];
        //        for (var i = 0; i < res.rows.length; i++) {

        //        }

        //    } else { }
        //}, function (error) {
        //});



   // }





    //document.addEventListener("deviceready", onDeviceReady, false);
    //function onDeviceReady() {
    //    var db = window.sqlitePlugin.openDatabase({ name: "my.db", location: 1 });
    //}
    ////document.addEventListener("deviceready", init, false);
    ////var app = {};
    ////app.db = null;

    //app.openDb = function () {
    //    if (window.sqlitePlugin !== undefined) {
    //        app.db = window.sqlitePlugin.openDatabase("My Database");
    //        alert("aaa");
    //    } else {
    //        // For debugging in simulator fallback to native SQL Lite
    //        app.db = window.openDatabase("My Database", "1.0", "Cordova Demo", 200000);
    //        alert("bbb");
    //    }
    //}

    //function init() {
    //    app.openDb();
    //}

    


})

.controller('descriptionCtrl', function ($scope) {

    //保存したデータの読み出し
    var strword = $scope.getDataFromStrage(1);

    //削除
    $scope.deleteStrage(1);
    
    $scope.items = [];

    $scope.addData = function (strword) {
        $scope.items.push({
            title: strword,
        });
    };

    //配列にデータを加える
    $scope.addData(strword);

    function $(id) {
        return document.getElementById(id);
    }

    var html;
    html = "<strong>them</strong>is born, it is reckoned ominous, and their birth is recorded very particularly so that you may know their age by consulting the" +
               " <strong>register</strong>, which, however, has not been kept above a thousand years past, or at least has Some friendly" +
                "<strong>markdown</strong>";

    $scope.CreateOpenDB();
    showItems();

    // アイテムの一覧を表示 -------(*2)
    function showItems() {
        $("example_sentence").innerHTML = "";
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT rowid, sentence FROM m_docSentence where sentence LIKE '%" + strword + "%'", [],
              showItemsOnResult,
              $scope.sqlError);
        });        
    }

    function showItemsOnResult(rt, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            html = html + row.sentence;

            $("example_sentence").innerHTML = html;

        }
    }




    $("example_sentence").innerHTML = html;

    html = "registration 記載，登記，登録; 記名 〔of〕";

    $("reference_zone").innerHTML = html;

    html = "rgisterはTOEICで最も使用頻度の高かった重要語です。忘れないようにしましょう。 Some friendly";
    $("one_word_zone").innerHTML = html;

    html = "登録する，記載する，登記する";
    $("meaning_zone").innerHTML = html;
    





})

.controller('questionCtrl', function ($scope) {

})
.controller('resultsCtrl', function ($scope) {

    $scope.items = [];

    //データ取得関連の処理
    var getResults = function () {

        //まずは一覧を取得(T_Users_Wordsとm_word_questionsで一致しているもののみを出力)
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT DISTINCT T_Users_Words.word FROM T_Users_Words INNER JOIN m_word_questions ON T_Users_Words.word = m_word_questions.word ORDER BY T_Users_Words.word ASC", [],
              showItemsOnResult,
              $scope.sqlError);
        });
    }

    //結果取得（単語一覧）
    var showItemsOnResult = function (rt, rs) {
        var strword;
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            strword = row.word;

            //この単語を元にOK/NGの結果を取得（呼び込む関数は別にする）
            getResultsEachWord(strword);
        }
    }

    var getResultsEachWord = function (strword) {
        //OK or NGを取得（意味も取得するため、）
        db.transaction(function (tr) {
            tr.executeSql(
              "SELECT * FROM T_Users_Words INNER JOIN m_words ON T_Users_Words.word = m_words.word WHERE T_Users_Words.word LIKE '" + strword + "' ORDER BY access DESC LIMIT 10", [],
              showItemsEachWord,
              $scope.sqlError);
        });
    };

    //結果取得（単語毎）
    var showItemsEachWord = function (rt, rs) {
        var strword;
        var intOKCnt=0;
        var intNGCnt = 0;
        var lngOKPercent = 0;
        var strmeaning;
        var strIcon;
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            strword = row.word;
            intOKCnt = intOKCnt + (typeof row.OK === "undefined" ? 0 : row.OK);
            intNGCnt = intNGCnt + (typeof row.NG === "undefined" ? 0 : row.NG);
            strmeaning = row.meaning;
        }
        lngOKPercent = (intOKCnt / (intOKCnt + intNGCnt)) * 100;
        lngOKPercent = lngOKPercent.toFixed(1);


        //アイコンの設定
        //70以上はニコニコアイコン
        if (Number(lngOKPercent) >= 70) {
            strIcon ="icon ion-happy-outline no-padding"
        }
            //40～70までは普通の顔アイコン
        else if (Number(lngOKPercent) >= 40 && Number(lngOKPercent) < 70) {
            strIcon = "icon ion-android-sad no-padding"
        }
            //40未満は残念アイコン
        else if (Number(lngOKPercent) < 40) {
            strIcon = "icon ion-sad no-padding"
        }

        //関数を分けてやらないと上手に登録できない（なぞ）
        pushResults(strword, lngOKPercent, intOKCnt, intNGCnt, strmeaning, strIcon);
    }

    //配列にデータを入れる関数
    var pushResults = function (strword, lngOKPercent, intOKCnt, intNGCnt, strmeaning, strIcon) {
        $scope.items.push({
            title: strword,
            OKPercent: Number(lngOKPercent),
            OK: intOKCnt,
            NG: intNGCnt,
            ALL: intOKCnt + intNGCnt,
            meaning: strmeaning,
            icon: strIcon,
        });
    }



    //DBオープン
    $scope.CreateOpenDB();
    getResults();




            //$scope.items = [
            //                  { title: 0, rank:0 },
            //                  { title: 1, rank:1 },
            //                  { title: 2, rank:2 },
            //                  { title: 3, rank:3 },
            //                  { title: 4, rank:4 },

            //];


})

.controller('realExamCtrl', function ($scope) {

})

.controller('settingsCtrl', function ($scope, $ionicPopup, $timeout, $state) {

    //すべてリセットするか確認
    $scope.askReset = function (intno) {
        var strtitle;
        var strtemplate;



        //intno=0のときは進捗データのみの削除
        //intno=1のときはすべてのデータを削除
        if (intno == 0) {//進捗データのみの削除
            strtitle = "<style>.popup-title </style><p>進捗リセット<p/>"
            strtemplate = "<b>どこまで解いたかの「進捗データ」、「問題の並び」をリセットしますか</b>"
        }
        else if (intno == 1) {  //学習データのリセット
            strtitle = "<style>.popup-title </style><p>リセット<p/>"
            strtemplate = "<b>過去の正答/誤答データをリセットしますか</b>"
        }
        else if (intno == 2) {//すべてのデータを削除
            strtitle = "<style>.popup-title </style><p>リセット<p/>"
            strtemplate = "<b>すべてのデータをリセットしますか（データベース関連）<br>※元には戻せません</b>"
        }


        var confirmPopup = $ionicPopup.confirm({
            title: strtitle,
            template: strtemplate,
            buttons: [
                {//二つ目ボタン
                    text: 'はい',
                    type: 'button-positive',
                    onTap: function (e) {
                        //ローカルストレージのデータを削除（シャッフルされた問題もどこまで解いたかも）
                        $scope.deleteStrage(1); //配列
                        $scope.deleteStrage(2); //どこまで解いたかの番号

                        //グローバルに宣言していた配列も初期化
                        arryshuffle_number = [];
                        intStaticQuestionStartNo = 1;

                        $scope.CheckIsVirtual();    //環境の確認（blnVirtualflgに開発環境か実機かを設定）


                        if (intno == 0) {//進捗のみリセットの場合はここでおしまい
                            informResetComplete();
                            return;
                        }
                        
                        //DBを開く（SQliteかWebSQLかはDBopen()内で判断している
                        $scope.DBopen();    //→これでdbオブジェクトが静的に設定される

                        //学習データをリセット
                        // テーブルを削除(T_Users_Words)→DROPするとSQLite側の処理で枠が完全に消されてしまうようなので
                        //一般的なDELETEにした（dbcopyプラグインのバグ？）
                        db.transaction(function (tr) {
                            tr.executeSql("DELETE FROM T_Users_Words", [], function () {

                            }, sqlError);
                        });

                        //DBcopyでアプリ内にコピーしたDBの削除
                        if (blnVirtualflg == false) {//実機環境の場合
                            //removeDB();     //DB削除
                            //copyされたDBは残した上で処理終了とする
                            //終了メッセージ
                            informResetComplete();

                            return
                        }

                        // テーブルを作成(t_Users_Words)→テーブルが全くないと検索時にエラーになるので枠だけ作成
                        //db.transaction(function (tr) {
                        //    tr.executeSql("CREATE TABLE IF NOT EXISTS T_Users_Words ( word TEXT NOT NULL, form, OK, NG , access DATE)", [], function () { /*console.log("t_Users_WordsCREATE OK");*/ }, sqlError);
                        //});

                        //if (intno == 1) {//学習データのリセットの場合はここでおしまい
                        //    return;
                        //}

                        //正答率閾値のリセット（この位置でないと学習データ削除時に削除されてしまう）
                        $scope.deleteStrage(3);



                        // テーブルをドロップ(m_words)
                        db.transaction(function (tr) {
                            tr.executeSql("DROP TABLE IF EXISTS m_words", [], function () {
                                // 次にまたテーブルをドロップ(m_word_questions)
                                db.transaction(function (tr) {
                                    tr.executeSql("DROP TABLE IF EXISTS m_word_questions", [], function () {
                                        //次にまたテーブルをドロップ(m_word_family)
                                        db.transaction(function (tr) {
                                            tr.executeSql("DROP TABLE IF EXISTS m_word_family", [], function () {
                                                // DBを開く（使用許諾については★WebSQLを使用する）
                                                db2 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                                                // テーブルをドロップ(License)
                                                db2.transaction(function (tr) {
                                                    tr.executeSql("DROP TABLE IF EXISTS License", [], function () {
                                                        //終了メッセージ
                                                        informResetComplete();
                                                    }, sqlError);
                                                });                                                
                                            }, sqlError);
                                        });

                                    }, sqlError);
                                });

                            }, sqlError);
                        });

                        return '0';
                    }
                },
                {//三つ目ボタン
                    text: '<b>いいえ</b>',
                    type: 'button-assertive',
                    onTap: function (e) {
                        '何もしない'
                        //location.href = '#/page1/page8'
                        return '2';
                    }
                }
            ]
        });
    }

    //SQLエラー時の処理
    function sqlError(tr, e) {
        alert("ERROR:" + e.message);
    }

    //SQliteのデータ削除処理
    function removeDB() {
        var location = 0;
        window.plugins.sqlDB.remove("words.db", location, rmsuccess, rmerror);
    }

    //SQlite、DB関係の処理
    function rmsuccess() {
        //open db and run your queries
        db = window.sqlitePlugin.openDatabase({ name: "words.db" });
    }

    function rmerror(e) {
        //db already exists or problem in copying the db file. Check the Log.
        console.log("Error Code = " + JSON.stringify(e));
        alert("Error Code = " + JSON.stringify(e));
        //e.code = 516 => if db exists
    }



    //終了時のメッセージ
    var informResetComplete = function () {
        var alertPopup = $ionicPopup.alert({
            title: "<style>.popup-title </style><p>お知らせ<p/>",
            template: "リセット完了しました",
        })
        $state.go('tabsController.study');  //studyページに戻る
    };

    //正答率の閾値を保持する関数
    $scope.keepPercent = function () {
        $scope.keepPercentBorderLine($scope.data.CorrectPercent)
    }


    //★画面起動時、復習時の正解率のボーダーパーセントを設定
    var intCorrectPercent;

    intCorrectPercent = $scope.getDataFromStrage(3);
    if (intCorrectPercent == "" || intCorrectPercent == null) {
        intCorrectPercent = 100;
        $scope.keepPercentBorderLine(intCorrectPercent);
    }

    $scope.data = { 'CorrectPercent': intCorrectPercent };


    $scope.$on('$ionicView.enter', function () {
        blnChangePercentBorderLine = true;   //Homeにもどるためのフラグ

    })

    
})

.controller('LicenseCtrl', function ($scope, $ionicPopup, $timeout, $http, $state, $interval) {

    $scope.LicenseAgree = function (blnAgreementflg) {

        if (blnAgreementflg == true) {  //使用許諾書に合意した場合
            //初期化
            m_wordsLength = 0;
            m_word_questionsLength = 0;
            m_word_familyLength = 0;
            blnExecutionflg = false;
            lngProgress = 0;    //プログレスバー用

            //「はい」ボタンは隠す
            document.getElementById("LicenseOK").className = "ng-hide";

            $scope.CheckIsVirtual();    //環境の確認（blnVirtualflgに開発環境か実機かを設定）
                if (blnVirtualflg == false) { //開発環境でなかったらsqliteの処理を実施
                    //事前に登録したDBをsqliteが使えるようにコピー
                    dbcopy();
                }

            // DBを開く（使用許諾については★WebSQLを使用する（開始時にまだSQliteが使用可能かわからないため））
            db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

            //合意あり（true）で登録（開発/実機環境ともにWebSQLのデータとして保持）
            strsql = "INSERT INTO License VALUES (?) "
            db.transaction(function (tr) {
                tr.executeSql(strsql, [true],
                  function () {                      
                      blnLicense_flg = true;
                      if (blnVirtualflg == false) { //実機の場合はこれで終了
                          //画面もはじめの画面に戻す
                          location.href = '#/page1/page2'
                          return;
                      }
                  },
                  $scope.sqlError);
            });



            //ここより下は★WebSQLの場合の処理

            document.getElementById("DataInsertProgress").className = "ng-show";    //プログレスバーを表示

            //処理中でない場合はDB構築（こうしないと画面が切り替わったタイミングでもう一度実行されてしまう）
            if (blnExecutionflg == false) { //処理中フラグ
                //まずDBを構築する
                // DBを開く
                db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                // テーブルを作成(m_words)
                db.transaction(function (tr) {
                    tr.executeSql("CREATE TABLE IF NOT EXISTS m_words (word TEXT NOT NULL, form, meaning)", [], function () {/*何もしない*/ }, sqlError);
                });

                // テーブルを作成(m_word_questions)
                db.transaction(function (tr) {
                    //tr.executeSql(strsql, function () { showItems(); }, sqlError);
                    tr.executeSql("CREATE TABLE IF NOT EXISTS m_word_questions ( word, source, sentence, correctAns, otherAns1, otherAns2, otherAns3, Japanese)", [], function () {/*何もしない*/ }, sqlError);
                });

                // テーブルを作成(m_word_family)
                db.transaction(function (tr) {
                    tr.executeSql("CREATE TABLE IF NOT EXISTS m_word_family ( word TEXT NOT NULL, word_family)", [], function () {/*何もしない*/ }, sqlError);
                });

                // テーブルを作成(t_Users_Words)
                db.transaction(function (tr) {
                    tr.executeSql("CREATE TABLE IF NOT EXISTS T_Users_Words ( word TEXT NOT NULL, form, OK INTEGER, NG INTEGER, access DATE)", [], function () { /*何もしない*/ }, sqlError);
                });

            }

            //JSONデータの取得(readAsTextはユーザが直接指定するイベントが必要なのでhttp方式とする）
            //dataは非同期処理に戻ってくるので注意
            //m_words
            $http.get('assets/m_words.json').success(function (data) {
                obj = angular.fromJson(data);
                intm_wordsCnt = 0;    //グローバルに宣言
                blnExecutionflg = true; //処理中フラグ

                // DBを開く
                db2 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                for (var i = 0; i < obj.length; i++) {
                    addItem(i, 1);  //sqlpattern=1はm_words    
                }
                m_wordsLength = obj.length;
            });

                       

        }

        //エラー時の動作
        function sqlError(tr, e) {
            '何もしない'
        }
        
    }


    // A confirm dialog △にするか聞く
    var askLicenseAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "<style>.popup-title </style><p>使用許諾書<p/>",
            template: "残念ながら使用許諾書に合意いただけなければ使用できません",
        });
    }

    //SQLエラー時の処理
    function sqlError(tr, e) {
        alert("ERROR:" + e.message);
    }

    // アイテムを追加 ----(*3)
    var addItem = function (i, sqlpattern) {
        var sqlpattern;

        switch (sqlpattern) {

            case 1://m_words
                var _word, _form, _meaning;
                _word = obj[i].word;
                _form = obj[i].form;
                _meaning = obj[i].meaning;

                db_insert_m_words(_word, _form, _meaning)

                break;

            case 2://m_word_questions
                var _word, _source, _sentence, _correctAns, _otherAns1, _otherAns2, _otherAns3, _Japanese;
                _word = obj[i].word;
                _sentence = obj[i].sentence;
                _source = obj[i].source;
                _correctAns = obj[i].correctAns;
                _otherAns1 = obj[i].otherAns1;
                _otherAns2 = obj[i].otherAns2;
                _otherAns3 = obj[i].otherAns3;
                _Japanese = obj[i].Japanese;

                db_insert_m_word_questions(_word, _source, _sentence, _correctAns, _otherAns1, _otherAns2, _otherAns3, _Japanese);


                break;

            case 3://m_word_family
                var _word, _word_family;
                _word = obj[i].word;
                _word_family = obj[i].word_family;

                db_insert_m_word_family(_word, _word_family)

                break;

            default:
                alert("ごめんなさい！");
                break;
        }

    }

    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert_m_words = function (word, form, meaning) {

        strsql = "INSERT INTO m_words VALUES (?, ?, ?) "
        db2.transaction(function (tr) {
            tr.executeSql(strsql, [word, form, meaning],
              function () {                  
                  intm_wordsCnt = intm_wordsCnt + 1

                  //プログレスバーの処理(おおむね全体の1/3とした）
                  startprogress();  //開始
                  lngProgress = Number(lngProgress + (1 / m_wordsLength) * 33.333)
                  $scope.progressval =lngProgress.toFixed(1); //小数第一位まで

                  if (intm_wordsCnt == m_wordsLength) {
                      console.log("mwordsOK")

                      //m_wordsが完了したらm_word_questionsを実行する（こうしないと上手に登録されない）
                      $http.get('assets/m_word_questions.json').success(function (data) {
                          obj = angular.fromJson(data);
                          intm_word_questionsCnt = 0; //グローバルに宣言

                          // DBを開く
                          db3 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                          for (var i = 0; i < obj.length; i++) {
                              addItem(i, 2);  //sqlpattern=2はm_word_questions
                          }
                          m_word_questionsLength = obj.length;
                      });
                      
                  }
              },
              $scope.sqlError);
        });
    }


    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert_m_word_questions = function (word, source, sentence, correctAns, otherAns1, otherAns2, otherAns3, Japanese) {

        strsql = "INSERT INTO m_word_questions VALUES (?, ?, ? ,?, ?, ?, ?, ?) "
        db3.transaction(function (tr) {
            tr.executeSql(strsql, [word, source, sentence, correctAns, otherAns1, otherAns2, otherAns3, Japanese],
              function () {
                  intm_word_questionsCnt = intm_word_questionsCnt + 1

                  //プログレスバーの処理
                  lngProgress = Number(lngProgress + (1 / m_word_questionsLength) * 33.333)
                  $scope.progressval = lngProgress.toFixed(1); //小数第一位まで


                  if (intm_word_questionsCnt == m_word_questionsLength) {
                      console.log("m_word_questionsOK")

                      //m_word_questionsが完了したらword_familyを実行する（こうしないと上手に登録されない）
                      $http.get('assets/m_word_family.json').success(function (data) {
                          obj = angular.fromJson(data);
                          intm_word_familyCnt = 0;  //グローバルに宣言

                          // DBを開く
                          db4 = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

                          for (var i = 0; i < obj.length; i++) {
                              addItem(i, 3);  //sqlpattern=3はm_word_family
                          }
                          m_word_familyLength = obj.length;
                      });

                  }
                  /*console.log("m_word_questions INSERT OK");*/
              },
              $scope.sqlError);
        });
    }
    
    //何か関数を分けないと同じデータが登録されてしまう
    var db_insert_m_word_family = function (word, word_family) {

        strsql = "INSERT INTO m_word_family VALUES (?, ?) "
        db4.transaction(function (tr) {
            tr.executeSql(strsql, [word, word_family],
              function () {                  
                  intm_word_familyCnt = intm_word_familyCnt + 1

                  //プログレスバーの処理
                  lngProgress = Number(lngProgress + (1 / m_word_familyLength) * 35)
                  $scope.progressval = lngProgress.toFixed(1); //小数第一位まで


                  if (intm_word_familyCnt == m_word_familyLength) {
                      console.log("m_word_familyOK")

                      //画面もはじめの画面に戻す
                      location.href = '#/page1/page2'
                  }
                  /*console.log("m_word_family OK"); */
              },
              $scope.sqlError);
        });
    }

    //SQlite、DB関係の処理
    function copysuccess() {
        //open db and run your queries
        //     db = window.sqlitePlugin.openDatabase({ name: "words.db", location: 'default' });

        // DBを開く（使用許諾については★WebSQLを使用する）
        db = openDatabase("words.db", "1.0", "words", 1024 * 1024 * 10);

        //合意あり（true）で登録（開発/実機環境ともにWebSQLのデータとして保持）
        strsql = "INSERT INTO License VALUES (?) "
        db.transaction(function (tr) {
            tr.executeSql(strsql, [true],
              function () {
                  blnLicense_flg = true;

                  if (blnVirtualflg == false) { //実機の場合はこれで終了
                      //画面もはじめの画面に戻す
                      $state.go('tabsController.myEitagon');  //初めのページに戻る
               //       location.href = '#/page1/page2'
                      return;
                  }
              },
              $scope.sqlError);
        });


    }

    function copyerror(e) {
        //db already exists or problem in copying the db file. Check the Log.
        console.log("Error Code = " + JSON.stringify(e));
        alert("Error Code = " + JSON.stringify(e));
        //e.code = 516 => if db exists
    }

    function dbcopy() {
        //Database filename to be copied is demo.db
        //location = 0, will copy the db to default SQLite Database Directory
        window.plugins.sqlDB.copy("words.db", 0, copysuccess, copyerror);

    }


    //プログレスバーの処理
    $scope.progressval = 0;
    $scope.stopinterval = null;
  
  
    function startprogress()
    {
        //$scope.progressval = 0;
    
        if ($scope.stopinterval)
        {
            $interval.cancel($scope.stopinterval);
        }
        
        //インターバルを取得する関数
        $scope.stopinterval = $interval(function() {
           // $scope.progressval = $scope.progressval + 1;
            if( $scope.progressval >= 100 ) {
                $interval.cancel($scope.stopinterval);
                $state.go('tabsController.myEitagon');  //初めのページに戻る
                return;
            }
        }, 100);
    }

    


})

.controller('manualCtrl', function ($scope) {



})