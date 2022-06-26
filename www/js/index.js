/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

var db;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    $("#divAddStdBtn").show();
    // Cordova is now initialized. Have fun!
    /*console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready'); */

    //open the database
    db = window.sqlitePlugin.openDatabase (
        { name: 'students.db', location:'default'},
        function() {
            alert("DB Opened Seuccessfully!");
        },
        function() {
            alert("DB Failed to open!");
        }
    );

    //create a table
    db.transaction (
        function(tx) {
            var query="CREATE TABLE IF NOT EXISTS studentTbl (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL);";
            tx.executeSql( query, [],
                function(tx, result) {
                    alert("Table created Successfully!");
                },
                function(err) {
                    alert("error occured:"+err.code);
                });         
    });

    var link1 = crossroads.addRoute("/sqliteclick", function(){

    });

    var link2 = crossroads.addRoute('viewstudent/{id}', function(id) {
        var ids = String( parseInt(id)+1 );
        alert("click on student id success! " + ids);

        //read the table, and put data into form
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM studentTbl where id = ?', [ids],
                function(tx, results) {
                    var len = results.rows.length;
                    $("#studentidshow").val(ids);
                    $("#studentnameshow").val(results.rows.item(0).name);
                    $("#studentphoneshow").val(results.rows.item(0).phone);
                
                }
            );
        });

        //show and hide the required div's
        $("#divStudentList").hide();
        $("#divFrmShowStudent").show();
    });

    var link3 = crossroads.addRoute('btnAddStudent' , function() {
        //your code here
        $("#divFrmInputStudent").show();
        $("#divStudentList").hide();
        $("#divFrmShowStudent").hide();
    });

    //setup hasher
    function parseHash(newHash, oldHash){
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change

    /*
    //insert data into studentTbl
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO studentTbl (name, phone) VALUES ('Afiq', '0112155311');", [],
                        function (tx, results) {
                           alert("yayyy dapat insertt");
                            //what is written inside htmlText? 
                                //All data from studentTB table will we written in htmlText String variable.
                        });
    });
    */

    //GET DATA FROM studentTbl
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM studentTbl;", [],
                        function (tx, results) {
                            var len = results.rows.length;
                            alert(len + " je yang ada length diaa");

                            if (len > 0) { //some data exists in table, do the process of displaying
                                htmlText = "";
                                for (i = 0; i < len; i++) {
                                    
                                    htmlText = htmlText + "<tr><td>" + "<a href='#viewstudent/" + i + "' >" + (i+1) + "</a></td><td>"+results.rows.item(i).name +
                                    "</td><td>" + results.rows.item(i).phone + "</td></tr>";
                                    
                                }
                                $('#tblStudent tbody').html(htmlText);
                                $('#divStudentList').show();
                            }
                            
                            //what is written inside htmlText? 
                                //All data from studentTB table will we written in htmlText String variable.
                        });
    });

    $("#divFrmInputStudent").submit(function(e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var name = $("#studentnameinput").val();
        var phone = $("#studentphoneinput").val();

        //db transaction

        db.transaction(function(tx) {
            var query = "insert into studentTbl (name, phone) values (?, ?)";
            tx.executeSql(query,
                          [name, phone],
                          function (tx, results) {
                            alert("Data inserted!");
                          },
                          function (error) {
                            alert("Error, try again!");
                          });
        });
    });   
}
