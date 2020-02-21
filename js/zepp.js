jQuery.browser={};(function(){jQuery.browser.msie=false;
jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();


var JS_Session_ID = '';
var ZEpp = ZEpp || {};

var ZEpp_Language = navigator.language; //'de';
var ZEpp_Version = "1.0";

var JCrop_api;
var Frontend_Language = window.localStorage.getItem('Application_Language');

if(Frontend_Language!='') { // if no language in memory, we use the browser language
    ZEpp_Language = Frontend_Language;
}

var marker_Groups = {};
var JS_Marker_already_dropped = {};
var map_circles = {};

// Begin boilerplate code generated with Cordova project.

var app = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        //alert('Deviceready!!');

        //if(StatusBar) {
        //
        //    StatusBar.overlaysWebView(false);
        //    StatusBar.backgroundColorByHexString("#333"); // => #333333
        //
        //    alert('Statusbar OK!!');
        //}

        //alert('weiter gehts!!');

        app.receivedEvent('deviceready');


        /* cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
            switch(status){
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    alert("Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    alert("Permission granted");
                    navigator.geolocation.getCurrentPosition(fct_geolocation_onSuccess, fct_geolocation_onError);
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    alert("Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    alert("Permission permanently denied");
                    break;
            }
        }, function(error){
            alert(error);
        }); */

        /* cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
            console.log("Location is " + (enabled ? "enabled" : "disabled"));
            if(!enabled){
                cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                    console.log("Authorization status is now: "+status);
                }, function(error){
                    console.error(error);
                });
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        }); */



        //cordova.plugins.notification.badge.set(4);

        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.CAMERA, function( status ){
            if ( status.hasPermission ) {
                //alert("CAMERA: Yes");
            }
            else {
                //alert("CAMERA: No");
            }
        });

        permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, function( status ){
            if ( status.hasPermission ) {
                //alert("ACCESS_COARSE_LOCATION: Yes");
            }
            else {
                //alert("ACCESS_COARSE_LOCATION: No, requesting...");
                //permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, geolocation_permission_success, geolocation_permission_error);
                //alert("Request finished.");
            }
        });

        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function( status ){
            if ( status.hasPermission ) {
                //alert("ACCESS_FINE_LOCATION: Yes");
            }
            else {
                //alert("ACCESS_COARSE_LOCATION: No, requesting...");
                //permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, geolocation_permission_success, geolocation_permission_error);
                //alert("Request finished.");
            }
        });

        //permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, geolocation_permission_success, geolocation_permission_error);

        //navigator.geolocation.getCurrentPosition(fct_geolocation_onSuccess, fct_geolocation_onError);

        //alert('yes, ok!');

        navigator.globalization.getPreferredLanguage(
            function (language) {
                //alert('Globalization language: ' + language.value);
                var Arr_Languages = language.value.split('-');
                                
                var Globalization_Language = Arr_Languages[0];
                
                if(Frontend_Language!='') { // if still no language in memory, we use the globalization language
                    ZEpp_Language = Globalization_Language;
                }
                
                //alert('Setting preferred language: ' + ZEpp_Language);
                //window.localStorage.setItem('Application_Language', ZEpp_Language);
                //alert('language: ' + language.value + '\n');
            },
            function () {
                console.log('Error getting language');                
            }
        );

        //navigator.geolocation.getCurrentPosition(fct_geolocation_onSuccess, fct_geolocation_onError);


    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }

};

app.initialize();

// End boilerplate code.








var URL_Parameters = {};
var Var_Name  = '';
var Var_Value = '';


$(document).on('pagebeforeshow', function () {

    var URL = $.mobile.path.parseUrl(window.location).toString();
    console.log('URL of this page: ' + URL);

    var parameter_line = URL.split("?")[1];

    if(parameter_line) {

        var Arr_Variables = parameter_line.split("&");

        $.each( Arr_Variables, function( Variable_Kombi_key, Variable_Kombi_value ) {

            console.log('Variables: ' + Variable_Kombi_value);

            var Arr_Variable_Kombi = Variable_Kombi_value.split('=');

            Var_Name  = Arr_Variable_Kombi[0];
            Var_Value = Arr_Variable_Kombi[1];

            console.log('Variables: ' + Var_Name + ': ' + Var_Value);
            //alert('Variables: ' + Var_Name + ': ' + Var_Value);

            URL_Parameters[Var_Name] = Var_Value;

        });

        console.log('Variables: stored in URL_Parameters');
        console.log(JSON.stringify(URL_Parameters));

    } else {

        console.log('No GET Variables on this page');

    }

});




$(document).on("pagecontainerbeforeshow", function (event, ui) {

    if (typeof ui.toPage == "object") {

        switch (ui.toPage.attr("id")) {

            ////////////////
            // index.html

            case "PAGE_ID_Splash":
                initiate_language("Splash");
            break;

            case "PAGE_ID_Login":
                initiate_language("Login");                
                app.SignInController.resetSignInForm(); // Reset signin form.
            break;

            case "PAGE_ID_Register":
                initiate_language("Register");
                app.RegisterController.resetRegisterForm(); // Reset register form.
            break;

            case "PAGE_ID_Password_Reset":
                initiate_language("Password_Reset");
                app.PasswordResetController.resetPasswordResetForm(); // Reset register form.
            break;

            case "PAGE_ID_Provisional_Password":
                initiate_language("Provisional_Password");
            break;

            case "PAGE_ID_Account_Locked":
                initiate_language("Account_Locked");
            break;

            case "PAGE_ID_Reset_Successful":
                initiate_language("Reset_Successful");
            break;

            case "PAGE_ID_Register_Successful":
                initiate_language("Register_Successful");
            break;
            
            case "PAGE_ID_Change_Password":
                initiate_language("Change_Password");
            break;

            case "PAGE_ID_ZEpp":
                initiate_language("ZEpp");
            break;

            // index.html
            ////////////////


            case "PAGE_ID_Impressum":
                initiate_language("Impressum");
            break;

            ////////////////
            // my_locations.html

            case "PAGE_ID_My_Locations":
                console.log('My Locations Start');
                    initiate_language("My_Locations");
                    //setTimeout(function(){
                    //    fct_check_for_messages();
                    //}, 5000);
                console.log('My Locations End');
            break;

            // my_locations.html
            ////////////////


            
            case "PAGE_ID_Location_Details":
                console.log('Location Details Start');
                initiate_language("Location_Details");
                var Action_ID_Edit = URL_Parameters['Action_ID_Edit'];
                //alert(ZIL_Edit);
                fct_get_location_details(Action_ID_Edit);
                //fct_get_location_single(ZIL_Edit);
                console.log('Location_Details End');
            break;

            case "PAGE_ID_Edit_Location":
                console.log('Edit Location Start');
                initiate_language("Edit_Location");
                var Action_ID_Edit = URL_Parameters['Action_ID_Edit'];
                //alert(ZIL_Edit);
                fct_edit_location(Action_ID_Edit);
                console.log('Edit Location End');
            break;

            case "PAGE_ID_Add_Location":
                console.log('Add Location Start');
                initiate_language("Add_Location");
                console.log('Add Location End');
            break;


            case "PAGE_ID_Add_Origin":
                console.log('Add Origin Start');
                initiate_language("Add_Origin");
                console.log('Add Origin End');
            break;

            case "PAGE_ID_Add_Location_Barcode":
                console.log('Add Location Barcode Start');
                initiate_language("Add_Location_Barcode");
                var Scan_ID = URL_Parameters['Scan_ID'];
                fct_add_location_barcode(Scan_ID);
                console.log('Add Location Barcode End');
            break;

            case "PAGE_ID_Edit_Origin":
                console.log('Edit Origin Start');
                initiate_language("Edit_Origin");
                var ZIO_Edit = URL_Parameters['ZIO'];
                fct_edit_origin(ZIO_Edit);
                console.log('Edit Origin End');
            break;

            case "PAGE_ID_Profile":
                console.log('Profile Start');
                initiate_language("Profile");
                console.log('Profile End');
            break;

            case "PAGE_ID_Assistant_1":

                console.log('Assistant Step 1 Start');
                initiate_language("Assistant_1");
                console.log('Assistant Step 1 End');

            break;

            case "PAGE_ID_Assistant_2":

                console.log('Assistant Step 2 Start');
                initiate_language("Assistant_2");
                console.log('Assistant Step 2 End');

            break;

            case "PAGE_ID_Assistant_3":

                console.log('Assistant Step 3 Start');
                initiate_language("Assistant_3");
                console.log('Assistant Step 3 End');

            break;

            case "PAGE_ID_Application":
                console.log('Application Start');
                    initiate_language("Application");
                    //setTimeout(function(){
                    //    fct_check_for_messages();
                    //}, 5000);
                console.log('Application End');
            break;


            case "PAGE_ID_Confirm_E_Mail":
                console.log('Confirm E-Mail Start');
                initiate_language("Confirm_E_Mail");
                var str_e_mail        = URL_Parameters['email'];
                var str_security_code = URL_Parameters['securitytoken'];
                
                if(str_e_mail==undefined) {str_e_mail='';}
                if(str_security_code==undefined) {str_security_code='';}               

                fct_confirm_e_mail(str_e_mail, str_security_code);
                
                console.log('Confirm E-Mail Start');
            break;

            case "PAGE_ID_Add_Origin_Barcode":
                console.log('Add Origin Barcode Start');
                initiate_language("Add_Origin_Barcode");
                var Scan_ID = URL_Parameters['Scan_ID'];
                //alert(ZIL_Edit);
                fct_add_origin_barcode(Scan_ID);
                console.log('Add Origin Barcode End');
            break;

            case "PAGE_ID_My_Origins":

                console.log('Origins Procedure Start');

                    initiate_language("My_Origins");
                    
                    //setTimeout(function(){
                    //    fct_check_for_messages();
                    //}, 5000);
    
                    var Section = URL_Parameters['Section'];
    
                    if(Section=='Origin_Home') {
    
                        setTimeout(function(){
                            $("#Origin_Tabs").tabs("option", "active", 0 );
                            $('#A_ID_Origin_Home').trigger('click');
                        }, 1);
    
    
                    } else if(Section=='Origin_Work') {
    
                        setTimeout(function(){
                            $("#Origin_Tabs").tabs("option", "active", 1 );
                            $('#A_ID_Origin_Work').trigger('click');
                        }, 1);
    
                        //alert('OK');
    
                    } else if(Section=='Origin_Interest') {
    
                        setTimeout(function(){
                            $("#Origin_Tabs").tabs("option", "active", 2 );
                            $('#A_ID_Origin_Interest').trigger('click');
                        }, 1);
    
                    }

                console.log('there');

            break;



            ////////////////
            // my_contacts.html

            case "PAGE_ID_My_Contacts":
                console.log('My Contacts Start');
                    initiate_language("My_Contacts");
                    
                    var Add_Contact_ID = URL_Parameters['Add_Contact_ID'];
                    //alert(Add_Contact_ID);
                    if(Add_Contact_ID > 0) {
                        fct_list_contacts(Add_Contact_ID);
                    } else {
                        fct_list_all_contacts();
                    }
                console.log('My Contacts End');
            break;

            // my_contacts.html
            ////////////////

        }

    }

});









$(document).delegate("#PAGE_ID_Assistant_1", "pagebeforecreate", function () {

    console.log('Assistant Step 1 Check Start');

    var Home_completed      = window.localStorage.getItem('Home_completed');
    var Holiday_completed   = window.localStorage.getItem('Holiday_completed');
    var Profile_completed   = window.localStorage.getItem('Profile_completed');
    var Assistant_completed = window.localStorage.getItem('Assistant_completed');

    console.log('Actual value Home_completed: '       + Home_completed);
    console.log('Actual value Holiday_completed: '    + Holiday_completed);
    console.log('Actual value Profile_completed: '    + Profile_completed);
    console.log('Actual value Assistant_completed: '  + Assistant_completed);
    //alert(Home_completed);

    if(Home_completed==1 && Holiday_completed==1 && Profile_completed==1) {
        window.localStorage.setItem('Assistant_completed', 1);
        //fct_goto_home_and_refresh();
    } else if(Home_completed==1 && Holiday_completed==1) {
        //document.location.href='#PAGE_ID_Assistant_3';
    } else if(Home_completed==1) {
        //document.location.href='#PAGE_ID_Assistant_2';
    } else {
        console.log('Origin setup start');
        fct_get_assistant_step_1();
        console.log('Origin setup done');
    }

    fct_get_assistant_step_1();

    console.log('Assistant Step 1 Check End');

});



$(document).delegate("#PAGE_ID_Assistant_2", "pagebeforecreate", function () {

    console.log('Assistant Step 2 Check Start');

    var Home_completed      = window.localStorage.getItem('Home_completed');
    var Holiday_completed   = window.localStorage.getItem('Holiday_completed');
    var Profile_completed   = window.localStorage.getItem('Profile_completed');
    var Assistant_completed = window.localStorage.getItem('Assistant_completed');
    console.log('Actual value Home_completed: '       + Home_completed);
    console.log('Actual value Holiday_completed: '    + Holiday_completed);
    console.log('Actual value Profile_completed: '    + Profile_completed);
    console.log('Actual value Assistant_completed: '  + Assistant_completed);

    if(Home_completed==1 && Holiday_completed==1 && Profile_completed==1) {
        window.localStorage.setItem('Assistant_completed', 1);
        //fct_goto_home_and_refresh();
    } else if(Home_completed==1 && Holiday_completed==1) {
        //document.location.href='#PAGE_ID_Assistant_3';
    } else if(Holiday_completed==1) {
        //document.location.href='#PAGE_ID_Assistant_3';
    } else {
        console.log('Holiday setup start');
        fct_get_assistant_step_2();
        console.log('Holiday setup done');
    }

    fct_get_assistant_step_2();

    console.log('Assistant Step 2 Check End');

});




$(document).delegate("#PAGE_ID_Assistant_3", "pagebeforecreate", function () {

    console.log('Assistant Step 3 Check Start');

    var Home_completed      = window.localStorage.getItem('Home_completed');
    var Holiday_completed   = window.localStorage.getItem('Holiday_completed');
    var Profile_completed   = window.localStorage.getItem('Profile_completed');
    var Assistant_completed = window.localStorage.getItem('Assistant_completed');
    console.log('Actual value Home_completed: '       + Home_completed);
    console.log('Actual value Holiday_completed: '    + Holiday_completed);
    console.log('Actual value Profile_completed: '    + Profile_completed);
    console.log('Actual value Assistant_completed: '  + Assistant_completed);

    if(Profile_completed==1) {
        window.localStorage.setItem('Home_completed', 1);
        window.localStorage.setItem('Holiday_completed', 1);
        window.localStorage.setItem('Profile_completed', 1);
        window.localStorage.setItem('Assistant_completed', 1);
        //fct_goto_home_and_refresh();
    } else {
        console.log('Profile setup start');
        fct_get_assistant_step_3();
        console.log('Profile setup done');
    }

    fct_get_assistant_step_3();

    console.log('Assistant Step 3 Check End');

});



$(document).delegate("#PAGE_ID_Login", "pagebeforecreate", function () {

    app.SignInController          = new ZEpp.SignInController();

    app.SignInController.init();

    app.SignInController.$btnSubmit.off("tap").on("tap", function () {
        app.SignInController.onSignInCommand();
        console.log('SignIn Controller Tap Event set');
    });

});


$(document).delegate("#PAGE_ID_Register", "pagebeforecreate", function () {

    app.RegisterController        = new ZEpp.RegisterController();

    app.RegisterController.init();

    app.RegisterController.$btnSubmit.off("tap").on("tap", function () {
        app.RegisterController.onRegisterCommand();
        console.log('Register Controller Tap Event set');
    });

});


$(document).delegate("#PAGE_ID_Password_Reset", "pagebeforecreate", function () {

    app.PasswordResetController   = new ZEpp.PasswordResetController();

    app.PasswordResetController.init();

    app.PasswordResetController.$btnSubmit.off("tap").on("tap", function () {
        app.PasswordResetController.onPasswordResetCommand();
        console.log('PasswordReset Controller Tap Event set');
    });


});


$(document).delegate("#DIV_ID_Options_Menu", "panelbeforeopen", function () {

    //alert('bound');

    //var session = ZEpp.Session.getInstance().get(), today = new Date();
    var Session_Info_String = '';

    if(session) {

        if(session.User_E_Mail) {
            Session_Info_String += '<zepp id="Language_Options_Logged_In_As">Logged in as:</zepp><br>' + session.User_E_Mail + '<br>';
        }

        //if(session.sessionId) {
        //    Session_Info_String += 'Session-ID:' + session.sessionId + '<br>';
        //}

        if(session.keepSignedIn && session.expirationDate) {

            var d1 = new Date(session.expirationDate);

            var yyyy = d1.getFullYear().toString();

            var mm = (d1.getMonth()+1).toString();
            mm = ( (mm*1) < 10 ? '0' : '' ) + mm;

            var dd  = d1.getDate().toString();
            dd = ( (dd*1) < 10 ? '0' : '' ) + dd;

            var hh  = d1.getHours().toString();
            hh = ( (hh*1) < 10 ? '0' : '' ) + hh;

            var MM  = d1.getMinutes().toString();
            MM = ( (MM*1) < 10 ? '0' : '' ) + MM;

            var ss  = d1.getSeconds().toString();
            ss = ( (ss*1) < 10 ? '0' : '' ) + ss;

            var str_time = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + MM + ':' + ss;


            Session_Info_String += '<br><zepp id="Language_Options_Signed_In_Until">Signed in until:</zepp><br>' + str_time + '<br>';

        }

        if($('#ZEpp_Session_Info')[0]) {
            $('#ZEpp_Session_Info')[0].innerHTML = Session_Info_String;
            //initiate_language('Susi');
        }


        $('#BTN_ID_Logout').off("tap").on("tap", function () {
            fct_logout_ZEpp();
        });

        if(document.getElementById('BTN_ID_Logout_1')) {
            $('#BTN_ID_Logout_1').off("tap").on("tap", function () {
                fct_logout_ZEpp();
            });
        }
        if(document.getElementById('BTN_ID_Logout_2')) {
            $('#BTN_ID_Logout_2').off("tap").on("tap", function () {
                fct_logout_ZEpp();
            });
        }
        if(document.getElementById('BTN_ID_Logout_3')) {
            $('#BTN_ID_Logout_3').off("tap").on("tap", function () {
                fct_logout_ZEpp();
            });
        }

        if(document.getElementById('BTN_ID_Edit_Profile')) {
            $('#BTN_ID_Edit_Profile').off("tap").on("tap", function () {
                fct_goto_profile_and_refresh();
            });
        }
        
        if(document.getElementById('BTN_ID_Change_Password')) {
            $('#BTN_ID_Change_Password').off("tap").on("tap", function () {
                fct_goto_change_password_and_refresh();
            });
        }


    }

});




$(document).on("pagecontainerbeforechange", function (event, ui) {

    if (typeof ui.toPage !== "object") return;

    //alert('OK');

    switch (ui.toPage.attr("id")) {

        case "PAGE_ID_Login":

            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.
                var session = ZEpp.Session.getInstance().get(), today = new Date();

                if(session) {

                    if(session.User_Assistant_OK) {
                        console.log('Actual session value Assistant_completed: ' + session.User_Assistant_OK);
                    }

                    var Assistant_completed = window.localStorage.getItem('Assistant_completed');
                    console.log('Actual memory value Assistant_completed: ' + Assistant_completed);

                    //alert(session.keepSignedIn);
                    if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                        //alert('weiter');
                        //ui.toPage = $("application.html");
                        //$.mobile.ajaxEnabled = false;
                        //$.mobile.navigate("application.html");
                        if(session.User_Assistant_OK == 1) {
                            //document.location.href = "application.html";
                            ui.toPage = $("#PAGE_ID_ZEpp");
                        } else if(Assistant_completed == 1) {
                            //document.location.href = "application.html";
                            ui.toPage = $("#PAGE_ID_ZEpp");
                        } else {
                            document.location.href = "assistant.html";
                        }
                    }

                }

            }
            break;

        case "PAGE_ID_Splash":

            //alert('OK');
            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.

                var session = ZEpp.Session.getInstance().get(), today = new Date();

                if(session) {

                    console.log('Actual session value Assistant_completed: ' + session.User_Assistant_OK);

                    var Assistant_completed = window.localStorage.getItem('Assistant_completed');
                    console.log('Actual memory value Assistant_completed: ' + Assistant_completed);

                    //alert(session.keepSignedIn);
                    if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                        //alert('weiter');
                        //ui.toPage = $("application.html");
                        //$.mobile.ajaxEnabled = false;
                        //$.mobile.navigate("application.html");
                        if(session.User_Assistant_OK == 1) {
                            //document.location.href = "application.html";
                            ui.toPage = $("#PAGE_ID_ZEpp");
                        } else if(Assistant_completed == 1) {
                            //document.location.href = "application.html";
                            ui.toPage = $("#PAGE_ID_ZEpp");
                        } else {
                            document.location.href = "assistant.html";
                        }
                    }

                 }

            }
            break;

        case "PAGE_ID_ZEpp":

            if (!ui.prevPage) {

                // Check session.keepSignedIn and redirect to main menu.
                var session = ZEpp.Session.getInstance().get(), today = new Date();

                if(session) {

                    if(session.User_Assistant_OK) {
                        console.log('Actual session value Assistant_completed: ' + session.User_Assistant_OK);
                    }

                    var Assistant_completed = window.localStorage.getItem('Assistant_completed');
                    console.log('Actual memory value Assistant_completed: ' + Assistant_completed);

                    //alert(session.keepSignedIn);
                    if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                        //alert('weiter');
                        //ui.toPage = $("application.html");
                        //$.mobile.ajaxEnabled = false;
                        //$.mobile.navigate("application.html");
                        if(session.User_Assistant_OK == 1) {
                            document.location.href = "application.html";
                            //ui.toPage = $("#PAGE_ID_ZEpp");
                        } else if(Assistant_completed == 1) {
                            document.location.href = "application.html";
                            //ui.toPage = $("#PAGE_ID_ZEpp");
                        } else {
                            document.location.href = "assistant.html";
                        }
                    }

                }

            }
            break;



    }

});