if (Meteor.isClient) {

  Template.hello.helpers({

  });

  Template.hello.events({

      'click .sqlite':function(){
        testDB();
      }

  });


    function testDB() {

      //------------------------------------注----意---------------------------------------
      //-------------------------在iOS中，数据库文件必须放在www目录下-------------------------
      //-----在Xcode中，先将数据库文件放在Meteor项目的 “/Staging/www/” 目录下，部署程序即可-----
      //----------------------------------------------------------------------------------
      var db = window.sqlitePlugin.openDatabase({name: "bible.db", createFromLocation: 1});

      db.transaction(function(tx) {

          //单次查询BibleID表
          var strSQL = "select SN as sn,  ChapterNumber as chapternumber, FullName as fullname from BibleID;";

          tx.executeSql(strSQL, [], 
            function(tx, res) {

                //显示sql语句
                console.log(strSQL);

                console.log(" | " + "BibleID Table" + " | " + "SN" + " | " + "ChapterNumber" + " | " + "FullName");
                //循环显示结果
                for(var i=0;i<res.rows.length;i++)
                {
                    console.log(" | " + res.rows.item(i).sn + " | " + res.rows.item(i).chapternumber + " | " + res.rows.item(i).fullname);
                }

                //查询结果的数量
                console.log("查询结果: " + res.rows.length + " 个");

              }, function(e) {
              console.log("ERROR: " + e.message);
            });


          //单次查询Bible表
          var strSQL = "select ID as id,  Lection as lection  from Bible  where  VolumeSN=1 and ChapterSN=1 order by ID;";

          tx.executeSql(strSQL, [], 
            function(tx, res) {

                //显示sql语句
                console.log(strSQL);

                console.log(" | " + "Bible Table" + " | " + "ID" + " | " + "Lection");

                for(var i=0;i<res.rows.length;i++)
                {
                    console.log(" | " + res.rows.item(i).id + " | " + res.rows.item(i).lection);
                }

                console.log("查询结果: " + res.rows.length + " 个");


              }, function(e) {
                console.log("ERROR: " + e.message);
              });


      });
    }



}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
