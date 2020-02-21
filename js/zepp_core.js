

function geolocation_permission_error() {
    //alert('Geolocation can not be requested');
}
 
function geolocation_permission_success( status ) {
    //alert('OK - Request good');
    if( !status.hasPermission ) geolocation_permission_error();
}


var sec = 0;
var timer;

function pad ( val ) { 
    return val > 9 ? val : "0" + val; 
}
    
      
    

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
function fct_geolocation_onSuccess(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
}

// onError Callback receives a PositionError object
//
function fct_geolocation_onError(error) {
    //alert('code: '    + error.code    + '\n' +
    //      'message: ' + error.message + '\n');
    //alert('Oops - Request failed.');
}


///////////////////
// Camera functions


function fct_get_Profile_Image() {
    
    var options = {
        quality:            75    ,
        allowEdit:          true  ,
        targetWidth:        160   ,
        targetHeight:       160   ,        
        correctOrientation: true  ,
        cameraDirection:    1
    };
    
    //alert('Pic Start');
    
    navigator.camera.getPicture(Profile_Image_onSuccess, Profile_Image_onFail, options);
    
    //alert('Pic End');
    
}



function fct_set_language(str_language) {

    window.localStorage.setItem('Application_Language', str_language);
    document.location.reload();

}


function Profile_Image_onSuccess(imageURI) {
    
    var image = document.getElementById('IMG_ID_Profile_Image');
    image.src = imageURI;
    
    //$('#save_values_area')[0].style.display = 'inline-block';
    
    image.style.width   = '80px';
    image.style.height  = '80px';

    //var image2 = document.getElementById('myImage_Big');
    //image2.src = imageURI;

    var bild_button = document.getElementById('BTN_ID_Profile_Image_Button');
    bild_button.innerHTML = 'Change Image';
                    
    var upload_Loader = document.getElementById('DIV_ID_Upload_Loader');
    upload_Loader.style.display = 'inline-block';

    // !! Assumes variable imageURI contains a valid URL to a text file on the device,
    //    for example, cdvfile://localhost/persistent/path/to/file.txt

    var win = function (r) {
        //alert('fertig');
        $('#save_values_area')[0].innerHTML+="<br><br>Code = " + r.responseCode;
        $('#save_values_area')[0].innerHTML+="<br>Response = " + r.response;
        $('#save_values_area')[0].innerHTML+="<br>Sent = " + r.bytesSent;
        runScripts(document.getElementById('save_values_area')); // vor allem Ausblenden des Upload-Spinners
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();

    //options.fileKey = "file";
    //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    //options.mimeType = "text/plain";
    //options.mimeType = "image/jpeg";
    
    options.fileKey     = "fileUpload";
    options.fileName    = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType    = "image/jpeg";
    options.httpMethod  = "POST";
    options.chunkedMode = false;


    var params = {};
    params.JS_Session_ID = JS_Session_ID;
    options.params = params;        

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(ZEpp.Settings.ServerUrl + "/_app_api/set_profile_image.php"), win, fail, options);    
    
}


function Profile_Image_onFail(message) {
    //alert('Failed because: ' + message);
}


function fct_cancel_upload_image(Individual_ID) {
    
    JCrop_api.destroy();
    
    JCrop_api.disable();
    JCrop_api.enable();
        
    var bild_button = document.getElementById('BTN_ID_Profile_Image_Button');
    bild_button.style.display = 'inline-block';   
    
    $('#IMG_ID_Mitarbeiter_crop_' + Individual_ID)[0].src     = 'img/pixel/pixel.gif';
    $('#IMG_ID_Mitarbeiter_crop_' + Individual_ID)[0].style.width   = ''; // damit JCrop die Größe / Relation neu zusammen setzt
    $('#IMG_ID_Mitarbeiter_crop_' + Individual_ID)[0].style.height  = ''; // damit JCrop die Größe / Relation neu zusammen setzt
    
    $('#DIV_ID_Schritt_1a')[0].style.display = 'none';  
    $('#DIV_ID_Schritt_1b')[0].style.display = 'none';      
    $('#DIV_ID_Schritt_2')[0].style.display = 'inline-block'; 
     

}



function fct_upload_profile_image_from_crop_into_database(Individual_ID) {
                
    //$('#save_values_area')[0].style.display = 'inline-block'; 
    
    var cropimagefield = document.getElementById('cropimagefield').value;
    
    $('#Logo_imageform_' + Individual_ID).ajaxSubmit({
    
        url: ZEpp.Settings.ServerUrl + '/_app_api/set_profile_image.php', 
        type: 'post',
        data: ( {        
              Aktion:             'neu'           ,
              cropimagefield:     cropimagefield  ,
              JS_Session_ID:      JS_Session_ID   ,
              Individual_ID_Bild: Individual_ID    
        } ),
        
        success: function(data) { 
            
            //$('#save_values_area')[0].innerHTML = data;      
            
            var bild_button = document.getElementById('BTN_ID_Profile_Image_Button');
            if(ZEpp_Language=="de") {            
                bild_button.innerHTML = 'Profilbild &auml;ndern';
            } else {
                bild_button.innerHTML = 'Change Profile Image';
            }
            bild_button.style.display = 'inline-block';
            
            $('#DIV_ID_Schritt_1a')[0].style.display = 'none';  
            $('#DIV_ID_Schritt_1b')[0].style.display = 'none';  
            
            $('#DIV_ID_Schritt_2')[0].style.display = 'none'; 
                          
            //alert('hochgeladen');
                   
            $.ajaxQueue({
                url:  ZEpp.Settings.ServerUrl + '/_app_api/get_new_profile_image.php',
                data: ( {
                      Aktion:             'neu'          ,
                      JS_Session_ID:      JS_Session_ID   ,
                      Individual_ID_Bild: Individual_ID 
                } ),
                type: 'POST',
                success: function(data) {
                    $('#save_values_area')[0].innerHTML = data;                                
                    var image = document.getElementById('IMG_ID_Profile_Image');
                    image.src = ZEpp.Settings.ServerUrl + '/img/individuals/individual_' + Individual_ID + '/' + data;
                }, 
                error: function (xhr, ajaxOptions, thrownError) {
                    var error_text = 'Error: ';
                    error_text += xhr;
                    //error_text += fct_get_Error_Text(xhr);
                    $('#save_values_area')[0].innerHTML = error_text;                    
                }
            });
            
        },
        
        error: function (xhr, ajaxOptions, thrownError) {
            var error_text = 'Error: ';
            error_text += xhr;
            //error_text += fct_get_Error_Text(xhr);
            $('#save_values_area')[0].innerHTML = error_text;
            
            var bild_button = document.getElementById('BTN_ID_Profile_Image_Button');
            bild_button.innerHTML = 'Change Image';
            bild_button.style.display = 'inline-block';

            
        }
        
    });   
    
}



function validate_date(some_date_value, str_Input_ID) {
    
    var Arr_month_IDs_to_Names = [];
    
    Arr_month_IDs_to_Names[0]   = '';
    Arr_month_IDs_to_Names[1]   = 'Jan';
    Arr_month_IDs_to_Names[2]   = 'Feb';
    Arr_month_IDs_to_Names[3]   = 'Mar';
    Arr_month_IDs_to_Names[4]   = 'Apr';
    Arr_month_IDs_to_Names[5]   = 'May';
    Arr_month_IDs_to_Names[6]   = 'Jun';
    Arr_month_IDs_to_Names[7]   = 'Jul';
    Arr_month_IDs_to_Names[8]   = 'Aug';
    Arr_month_IDs_to_Names[9]   = 'Sep';
    Arr_month_IDs_to_Names[10]   = 'Oct';
    Arr_month_IDs_to_Names[11]  = 'Nov';
    Arr_month_IDs_to_Names[12]  = 'Dec';
    
    var Erster_Punkt = some_date_value.indexOf(".", 0);
    var Zweiter_Punkt = some_date_value.indexOf(".", Erster_Punkt + 1);
    
    var Erster_Slash = some_date_value.indexOf("/", 0);
    var Zweiter_Slash = some_date_value.indexOf("/", Erster_Slash + 1);
    
    //alert(Erster_Punkt);
    //alert(Zweiter_Punkt);
    //alert(Erster_Slash);
    //alert(Zweiter_Slash);
    
    if( (Erster_Punkt > 0) && (Zweiter_Punkt > Erster_Punkt) ) {
    
        // Locale: de-xx
        // 24.2.77 -> 24-Feb-1977
        
        var str_tag   = some_date_value.substring(0, Erster_Punkt);
        var str_monat = some_date_value.substring((Erster_Punkt + 1) , Zweiter_Punkt);
        var str_jahr  = some_date_value.substring((Zweiter_Punkt + 1), 100);
        
        //alert(str_tag);
        //alert(str_monat);
        //alert(str_jahr);
        
        var int_tag   = str_tag   * 1;
        var int_monat = str_monat * 1;
        var int_jahr  = str_jahr  * 1;        
                
    } else if( (Erster_Slash > 0) && (Zweiter_Slash > Erster_Slash) ) {
    
        // Locale: en-us
        // 2/24/77 -> 24-Feb-1977
        
        var str_monat = some_date_value.substring(0, Erster_Slash);
        var str_tag   = some_date_value.substring((Erster_Slash + 1) , Zweiter_Slash);
        var str_jahr  = some_date_value.substring((Zweiter_Slash + 1), 100);
        
        //alert(str_tag);
        //alert(str_monat);
        //alert(str_jahr);
        
        var int_tag   = str_tag   * 1;
        var int_monat = str_monat * 1;
        var int_jahr  = str_jahr  * 1;
                    
    }
        
    
    if( (int_tag>0) && (int_tag<=31) && (int_monat>0) && (int_monat<=12) && (int_jahr>1900) && (int_jahr<3000) ) {
    
        
        if(int_tag<10) {
            var new_tag = "0" + int_tag;
        } else {
            var new_tag = int_tag;
        }
        
        if(int_monat<10) {
            var new_monat = "0" + int_monat;
        } else {
            var new_monat = int_monat;
        }
        
        if( (int_jahr<100) && (int_jahr > 20) ) {
            var new_jahr = "19" + int_jahr;
        } else if( (int_jahr<100) && (int_jahr <= 20) ) {
            var new_jahr = "20" + int_jahr;
        } else {
            var new_jahr = int_jahr;
        }
        
        //alert(Arr_month_IDs_to_Names[int_monat]);
        
        var new_date_string = "" + new_tag + "-" + Arr_month_IDs_to_Names[int_monat] + "-" + new_jahr;
        
        //alert(new_date_string);
        
        document.getElementById(str_Input_ID).value = new_date_string;
                
    }
            
}


function fct_do_change_profile(Profile_Code) {
    
    var ZEpp_Form_Firstname             = $('#ZEpp_Form_Firstname')[0].value;
    var ZEpp_Form_Gender                = $('#ZEpp_Form_Gender')[0].value;
    var ZEpp_Form_Birthdate             = $('#ZEpp_Form_Birthdate')[0].value;
    var ZEpp_Form_Language              = $('#ZEpp_Form_Language')[0].value;
    
    var Form_Authcode = document.getElementById('Form_Authcode_Profile').value;
    
    var ZEpp_Form_Status  = '';

    if(document.getElementById('ZEpp_Form_Family_Status_Single').checked == true) {
        ZEpp_Form_Status = 'Single';
    } else if(document.getElementById('ZEpp_Form_Family_Status_Relationship').checked == true) {
        ZEpp_Form_Status = 'Relationship';
    } else if(document.getElementById('ZEpp_Form_Family_Status_Married').checked == true) {
        ZEpp_Form_Status = 'Married';
    } 

    var ZEpp_Form_Kids  = '';

    if(document.getElementById('ZEpp_Form_Kids_No').checked == true) {
        ZEpp_Form_Kids = 'No';
    } else if(document.getElementById('ZEpp_Form_Kids_Yes').checked == true) {
        ZEpp_Form_Kids = 'Yes';
    } 

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/update_profile.php',
        data: ( {
              Type:                   'Profile'             ,
              Profile_Code:           Profile_Code          ,
              Form_Authcode:          Form_Authcode         ,
              
              ZEpp_Form_Firstname:  ZEpp_Form_Firstname ,
              ZEpp_Form_Gender:     ZEpp_Form_Gender    ,
              ZEpp_Form_Language:   ZEpp_Form_Language  ,
              ZEpp_Form_Birthdate:  ZEpp_Form_Birthdate ,
              ZEpp_Form_Status:     ZEpp_Form_Status    , 
              ZEpp_Form_Kids:       ZEpp_Form_Kids      ,
              
              ZEpp_Version:         ZEpp_Version        ,
              JS_Session_ID:          JS_Session_ID         ,
              Test:                   0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('Profile changed');
            //console.log(data);
            if($('#save_values_area')[0]) {
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));                
            }
        }
    });

}


function fct_get_Error_Text(xhr) {

    var error_text = '';

    if (xhr.status === 0) {
        var error_text = '<b>VPN nicht verbunden</b>';
    } else if (xhr.status == 404) {
        var error_text = '<b>VPN nicht verbunden</b>';
    } else if (xhr.status == 500) {
        var error_text = '<b>VPN nicht verbunden</b>';
    } else if (thrownError === 'timeout') {
        var error_text = '<b>Timeout</b>';
    } else if (thrownError === 'abort') {
        var error_text = '<b>Anfrage abgebrochen</b>';
    } else {
        var error_text = '<b>Sonstiger Fehler ' + xhr.responseText + '</b>';
    }

    return error_text;

}



function fct_confirm_e_mail(str_e_mail, str_security_code) {
    
    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/do_confirm_e_mail.php',
        data: ( {
              str_e_mail:             str_e_mail          ,
              str_security_code:      str_security_code   ,

              ZEpp_Version:         ZEpp_Version      ,
              JS_Session_ID:          JS_Session_ID       ,
              Test:                   0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('E-Mail confirm request send');
            //console.log(data);
            if($('#save_values_area')[0]) {
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));                
            }
        }
    });
    
}



function fct_do_change_password(Password_Code) {
    
    var ZEpp_Form_Old_Password            = $('#ZEpp_Form_Old_Password')[0].value;
    var ZEpp_Form_New_Password            = $('#ZEpp_Form_New_Password')[0].value;
    var ZEpp_Form_New_Password_2          = $('#ZEpp_Form_New_Password_2')[0].value;

    var Form_Authcode = document.getElementById('Form_Authcode_Change_Password').value;    

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/do_change_password.php',
        data: ( {
              Type:                       'Password'                  ,
              Password_Code:              Password_Code               ,
              Form_Authcode:              Form_Authcode               ,
              
              ZEpp_Form_Old_Password:   ZEpp_Form_Old_Password    ,
              ZEpp_Form_New_Password:   ZEpp_Form_New_Password    ,
              ZEpp_Form_New_Password_2: ZEpp_Form_New_Password_2  ,

              ZEpp_Version:             ZEpp_Version              ,
              JS_Session_ID:              JS_Session_ID               ,
              Test:                       0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('Password changed');
            //console.log(data);
            if($('#save_values_area')[0]) {
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));                
            }
        }
    });

}




function fct_do_change_map_options(Options_Code, Return_to_Page) {
    
    
    var Form_Authcode = document.getElementById('Form_Authcode_Map_Options').value;
    
    //alert(Return_to_Page);
    
    var ZEpp_Form_Age  = '';

    if(document.getElementById('Age_Filter_All').checked == true) {
        ZEpp_Form_Age = 'All';
    } else if(document.getElementById('Age_Filter_20_Percent').checked == true) {
        ZEpp_Form_Age = '20_Percent';
    }
    
    
    var ZEpp_Form_Status  = '';

    if(document.getElementById('ZEpp_Form_Family_Status_All').checked == true) {
        ZEpp_Form_Status = 'All';
    } else if(document.getElementById('ZEpp_Form_Family_Status_Single').checked == true) {
        ZEpp_Form_Status = 'Single';
    } else if(document.getElementById('ZEpp_Form_Family_Status_Relationship').checked == true) {
        ZEpp_Form_Status = 'Relationship';
    } else if(document.getElementById('ZEpp_Form_Family_Status_Married').checked == true) {
        ZEpp_Form_Status = 'Married';
    } 

    
    var ZEpp_Form_Kids  = '';

    if(document.getElementById('ZEpp_Form_Kids_All').checked == true) {
        ZEpp_Form_Kids = 'All';
    } else if(document.getElementById('ZEpp_Form_Kids_Yes').checked == true) {
        ZEpp_Form_Kids = 'Yes';
    } else if(document.getElementById('ZEpp_Form_Kids_No').checked == true) {
        ZEpp_Form_Kids = 'No';
    } 
    
    
    var ZEpp_Form_Radius_Vacation  = '';

    if(document.getElementById('Filter_Radius_Vacation_2').checked == true) {
        ZEpp_Form_Radius_Vacation = '2';
    } else if(document.getElementById('Filter_Radius_Vacation_5').checked == true) {
        ZEpp_Form_Radius_Vacation = '5';
    } else if(document.getElementById('Filter_Radius_Vacation_10').checked == true) {
        ZEpp_Form_Radius_Vacation = '10';
    } else if(document.getElementById('Filter_Radius_Vacation_15').checked == true) {
        ZEpp_Form_Radius_Vacation = '15';
    } else if(document.getElementById('Filter_Radius_Vacation_30').checked == true) {
        ZEpp_Form_Radius_Vacation = '30';
    } else if(document.getElementById('Filter_Radius_Vacation_50').checked == true) {
        ZEpp_Form_Radius_Vacation = '50';
    } else if(document.getElementById('Filter_Radius_Vacation_100').checked == true) {
        ZEpp_Form_Radius_Vacation = '100';
    } 
    
    
    var ZEpp_Form_Radius_Root  = '';

    if(document.getElementById('Filter_Radius_Root_2').checked == true) {
        ZEpp_Form_Radius_Root = '2';
    } else if(document.getElementById('Filter_Radius_Root_5').checked == true) {
        ZEpp_Form_Radius_Root = '5';
    } else if(document.getElementById('Filter_Radius_Root_10').checked == true) {
        ZEpp_Form_Radius_Root = '10';
    } else if(document.getElementById('Filter_Radius_Root_15').checked == true) {
        ZEpp_Form_Radius_Root = '15';
    } else if(document.getElementById('Filter_Radius_Root_30').checked == true) {
        ZEpp_Form_Radius_Root = '30';
    } else if(document.getElementById('Filter_Radius_Root_50').checked == true) {
        ZEpp_Form_Radius_Root = '50';
    } else if(document.getElementById('Filter_Radius_Root_100').checked == true) {
        ZEpp_Form_Radius_Root = '100';
    } 
    
    var ZEpp_Form_Time  = '';

    //if(document.getElementById('Time_Filter_Any').checked == true) {
    //    ZEpp_Form_Time = 'Any';
    //} else 
    if(document.getElementById('Time_Filter_Actual').checked == true) {
        ZEpp_Form_Time = 'Actual';
    } else if(document.getElementById('Time_Filter_Exact').checked == true) {
        ZEpp_Form_Time = 'Exact';
    } 

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/update_filter.php',
        data: ( {
              Type:                       'Filter'                    ,
              Options_Code:               Options_Code                ,
              Form_Authcode:              Form_Authcode               ,
              
              Map_Filter_Age:             ZEpp_Form_Age             ,
              Map_Filter_Kids:            ZEpp_Form_Kids            ,
              Map_Filter_Status:          ZEpp_Form_Status          ,
              Map_Filter_Radius_Vacation: ZEpp_Form_Radius_Vacation ,
              Map_Filter_Radius_Root:     ZEpp_Form_Radius_Root     , 
              Map_Filter_Radius_Time:     ZEpp_Form_Time            ,

              Return_to_Page:             Return_to_Page              ,
              
              ZEpp_Version:             ZEpp_Version              ,
              JS_Session_ID:              JS_Session_ID               ,
              
              Test:                       0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('Map Options changed');
            //console.log(data);
            if($('#save_values_area')[0]) {
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));                
            }
        }
    });

}



function fct_get_my_profile() {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_profile.php',
        data: ( {
              Type:             'Profile'           ,
              ZEpp_Version:   ZEpp_Version      ,
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('Profile loaded');
            //console.log(data);
            if($('#DIV_ID_My_Profile')[0]) {
                $('#DIV_ID_My_Profile')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_My_Profile'));
            }
        }
    });

}



/////////////////////
// Barcode

function fct_scan_location() {

    if (typeof cordova == 'undefined') { 
        alert('Scanning QR-Codes is only supported on mobile devices');
        return;
    }
    
    cordova.plugins.barcodeScanner.scan(
    
        function (result) {
            
            var str_text      = result.text;
            var str_format    = result.format;
            var str_cancelled = result.cancelled;
            
            fct_register_barcode_location(str_text, str_format, str_cancelled);
            
            //alert("We got a barcode\n" +
            //      "Result: " + result.text + "\n" +
            //      "Format: " + result.format + "\n" +
            //      "Cancelled: " + result.cancelled);
        },
        
        function (error) {
            
            alert("Scanning failed: " + error);
            
        },
        
        {
            preferFrontCamera :     false,  // iOS and Android
            showFlipCameraButton :  true,   // iOS and Android
            showTorchButton :       true,   // iOS and Android
            torchOn:                false,  // Android, launch with the torch switched on (if available)
            saveHistory:            false,  // Android, save scan history (default false)
            prompt :                "Place a QR-Code inside the scan area", // Android
            resultDisplayDuration:  500,    // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats :               "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation :           "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations :     true,   // iOS
            disableSuccessBeep:     false   // iOS and Android
        }
        
   );
        
}



function fct_enter_scan_location() {

    fct_register_barcode_location('https://nxto.me/_off?location=1&secure=624c9dfe235a07bcb8b5e8b62', 'QR_CODE', false);
    
}


function fct_register_barcode_location(str_text, str_format, str_cancelled) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/register_barcode_location.php',
        data: ( {
              Type:             'QR-Code Location'  ,
              
              ZEpp_Version:   ZEpp_Version      ,
              JS_Session_ID:    JS_Session_ID       ,
              str_text:         str_text            ,
              str_format:       str_format          ,
              str_cancelled:    str_cancelled       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('QR-Code submitted');
            //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));
        }
    });

}



function fct_scan_origin() {
    
    if (typeof cordova == 'undefined') { 
        alert('Scanning QR-Codes is only supported on mobile devices');
        return;
    }
    
    cordova.plugins.barcodeScanner.scan(
    
        function (result) {
            
            var str_text      = result.text;
            var str_format    = result.format;
            var str_cancelled = result.cancelled;
            
            fct_register_barcode_origin(str_text, str_format, str_cancelled);
            
            //alert("We got a barcode\n" +
            //      "Result: " + result.text + "\n" +
            //      "Format: " + result.format + "\n" +
            //      "Cancelled: " + result.cancelled);
        },
        
        function (error) {
            
            alert("Scanning failed: " + error);
            
        },
        
        {
            preferFrontCamera :     false,  // iOS and Android
            showFlipCameraButton :  true,   // iOS and Android
            showTorchButton :       true,   // iOS and Android
            torchOn:                false,  // Android, launch with the torch switched on (if available)
            saveHistory:            false,  // Android, save scan history (default false)
            prompt :                "Place a QR-Code inside the scan area", // Android
            resultDisplayDuration:  500,    // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats :               "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation :           "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations :     true,   // iOS
            disableSuccessBeep:     false   // iOS and Android
        }
        
   );
        
}


function fct_enter_scan_origin() {

    fct_register_barcode_origin('https://nxto.me/_off?origin=1&secure=de396a4b916e1c80a386ddd67', 'QR_CODE', false);
    
}


function fct_register_barcode_origin(str_text, str_format, str_cancelled) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/register_barcode_origin.php',
        data: ( {
              Type:             'QR-Code Origin'    ,
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              str_text:         str_text            ,
              str_format:       str_format          ,
              str_cancelled:    str_cancelled       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('QR-Code submitted');
            //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));
        }
    });

}




function fct_add_location_barcode(Scan_ID) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_location_barcode_form_request.php',
        data: ( {
              Type:             'Barcode_Add'   ,
              
              ZEpp_Version:   ZEpp_Version  ,              
              JS_Session_ID:    JS_Session_ID   ,
              Scan_ID:          Scan_ID         ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#Add_Location_Barcode')[0]) {
                $('#Add_Location_Barcode')[0].innerHTML = data;
                runScripts(document.getElementById('Add_Location_Barcode'));
            }
        }
    });

}


function fct_add_origin_barcode(Scan_ID) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_origin_barcode_form_request.php',
        data: ( {
              Type:             'Barcode_Add'   ,
              Scan_ID:          Scan_ID         ,
              
              ZEpp_Version:   ZEpp_Version  ,
              JS_Session_ID:    JS_Session_ID   ,              
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#Add_Origin_Barcode')[0]) {
                $('#Add_Origin_Barcode')[0].innerHTML = data;
                runScripts(document.getElementById('Add_Origin_Barcode'));
            }
        }
    });

}

// Barcode
////////////////////



///////////////////
// Native Storage (hmmm...)

function fct_nativestorage_store_success() {

    alert('save succeeded');
    
}

function fct_nativestorage_store_fail() {

    alert('failed to save');
    
}

function fct_nativestorage_get_success() {

    alert('get succeeded');
    
}

function fct_nativestorage_get_fail() {

    alert('failed to get');
    
}


// Native Storage (hmmm...)
///////////////////




///////////////////
// Contact Functions

function fct_list_contacts(Individual_ID) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_contacts_by_id.php',
        data: ( {
              Type:             'Contact'       ,
              Individual_ID:    Individual_ID   ,
              
              ZEpp_Version:   ZEpp_Version  ,
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Contact_List')[0]) {
                $('#DIV_ID_Contact_List')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Contact_List'));
            }
        }
    });

}



function fct_callback_notification() {

    //fct_goto_contacts_and_refresh();

}


function fct_list_all_contacts() {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_contacts_all.php',
        data: ( {
              Type:             'Contact'       ,
              
              ZEpp_Version:   ZEpp_Version  ,
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Contact_List')[0]) {
                $('#DIV_ID_Contact_List')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Contact_List'));
            }
        }
    });

}

function fct_send_message(Communication_ID, Chat_Code) {

    var str_Text      = $('#TEXTAREA_ID_' + Communication_ID).val();
    var Form_Authcode = document.getElementById('Form_Authcode_Send_Message').value;
    //alert(str_Text);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/save_post.php',
        data: ( {
              Type:               'Post'            ,
              Communication_ID:   Communication_ID  ,
              Form_Authcode:      Form_Authcode     ,
              Chat_Code:          Chat_Code         ,
              str_Text:           str_Text          ,
              
              ZEpp_Version:     ZEpp_Version    ,              
              JS_Session_ID:      JS_Session_ID     ,
              Test:               0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            
            if($('#save_values_area')[0]) {
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }
            
            $('#TEXTAREA_ID_' + Communication_ID)[0].value = '';
            //$('#TEXTAREA_ID_' + Communication_ID)[0].focus();
            fct_check_Posts(Communication_ID);
            //$.mobile.silentScroll(0);
            
            var div = document.getElementById('DIV_ID_Communication_' + Communication_ID);
            $('#DIV_ID_Communication_' + Communication_ID).animate({
                scrollTop: div.scrollHeight - div.clientHeight
            }, 500);
            
        }
        
    });

}

function fct_check_Posts(Communication_ID) {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_posts.php',
        data: ( {
              Type:                 'Post'            ,
              Communication_ID:     Communication_ID  ,
              
              ZEpp_Version:       ZEpp_Version    ,              
              JS_Session_ID:        JS_Session_ID     ,              
              Test:                 0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#Chat_Content_' + Communication_ID)[0]) {
            
                $('#Chat_Content_' + Communication_ID)[0].innerHTML = data;
                
                var scroll_height = document.getElementById('DIV_ID_Communication_' + Communication_ID).scrollHeight;
                var client_height = document.getElementById('DIV_ID_Communication_' + Communication_ID).clientHeight;
                var scroll_top    = document.getElementById('DIV_ID_Communication_' + Communication_ID).scrollTop;
                
                var scroll_grenze = scroll_height - client_height - 200;
                
                // Die Scrollgrenze deefiniert, ab wann wir nicht mehr mit dem Chat mitscrollen
                
                //alert(scroll_height);
                //alert(client_height);
                //alert(scroll_top);
                
                //alert(scroll_grenze);
                
                if( scroll_top > scroll_grenze || scroll_top == 0) {
                
                    //alert('fire');
                
                    var div = document.getElementById('DIV_ID_Communication_' + Communication_ID);
                    $('#DIV_ID_Communication_' + Communication_ID).animate({
                        scrollTop: div.scrollHeight - div.clientHeight
                    }, 500);
                
                }
                
                // Set the size of the rendered Emojis
                // This can be set to 16x16, 36x36, or 72x72
                twemoji.size = '16x16';
              
                // Parse the document body and
                // insert <img> tags in place of Unicode Emojis
                twemoji.parse(document.body);
                
                
                setTimeout(function(){ fct_check_Posts(Communication_ID); }, 3000);
            }
        }
    });

}


function fct_check_for_messages() {
        
    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/check_unread_messages.php',
        data: ( {
              Type:                 'Messages'        ,
              
              ZEpp_Version:       ZEpp_Version    ,              
              JS_Session_ID:        JS_Session_ID     ,
              Test:                 0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            console.log('Check done');
            //$.mobile.loading("hide");
            //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));            
            
            setTimeout(function(){
                fct_check_for_messages();
            }, 5000);                
        }
    });    

}

//
///////////////////




////////////////////////////////
// Assistant Functions

function fct_set_home(Set_Home_Code) {

    $("#DIV_ID_Add_Origin_Error").html("");
    $("#DIV_ID_Add_Origin_Error").removeClass().addClass("zepp-invisible");

    var Origin_Search           = document.getElementById('Origin_Search').value;
    
    var Form_Authcode           = document.getElementById('Form_Authcode_Assistant_Home').value;
          
    //var New_Origin_Start_Year   = document.getElementById('New_Origin_Start_Year').value;
    //var New_Origin_Start_Month  = document.getElementById('New_Origin_Start_Month').value;
    var New_Origin_Start_Date   = document.getElementById('New_Origin_Start_Date').value;

    var Origin_Places_ID        = document.getElementById('Origin_Places_ID').value;
    var Origin_Places_Name      = document.getElementById('Origin_Places_Name').value;

    var Origin_Places_Lat       = document.getElementById('Origin_Places_Lat').value;
    var Origin_Places_Lng       = document.getElementById('Origin_Places_Lng').value;
    var Origin_Places_PLZ       = document.getElementById('Origin_Places_PLZ').value;
    var Origin_Places_Ortsteil  = document.getElementById('Origin_Places_Ortsteil').value;
    var Origin_Places_Ort       = document.getElementById('Origin_Places_Ort').value;
    var Origin_Places_Land      = document.getElementById('Origin_Places_Land').value;    

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/set_home.php',
        data: ( {
              Type:                   'Origin_Home'           ,
              Origin_Places_ID:       Origin_Places_ID        ,
              Origin_Places_Name:     Origin_Places_Name      ,

              Set_Home_Code:          Set_Home_Code           ,
              Form_Authcode:          Form_Authcode           ,
              
              Origin_Places_Lat:      Origin_Places_Lat       ,
              Origin_Places_Lng:      Origin_Places_Lng       ,
              Origin_Places_PLZ:      Origin_Places_PLZ       ,
              Origin_Places_Ortsteil: Origin_Places_Ortsteil  ,
              Origin_Places_Ort:      Origin_Places_Ort       ,
              Origin_Places_Land:     Origin_Places_Land      ,

              Origin_Search:          Origin_Search           ,
              //New_Origin_Start_Year:  New_Origin_Start_Year   ,
              //New_Origin_Start_Month: New_Origin_Start_Month  ,
              New_Origin_Start_Date:  New_Origin_Start_Date   ,
              
              ZEpp_Version:         ZEpp_Version          ,              
              JS_Session_ID:          JS_Session_ID           ,

              Test:                   0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            $.mobile.loading("hide");
            console.log('Origin Response correct');
            //console.log(data);
            
            window.localStorage.setItem('Home_completed', 1);
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));            
            }
            
        }
    });

}


function fct_set_location(Set_Location_Code) {

    $("#DIV_ID_Location_Error").html("");
    $("#DIV_ID_Location_Error").removeClass().addClass("zepp-invisible");   
    
    var Location_Home_Toggle = '';        

    if(document.getElementById('SEL_ID_Home_no').checked==true) {
        Location_Home_Toggle = 'no';       
    } else if(document.getElementById('SEL_ID_Home_yes').checked==true) {
        Location_Home_Toggle = 'yes';       
    } else {
        Location_Home_Toggle = 'yes';       
    }

    var Location_Search                     = document.getElementById('Location_Search').value;
    var New_Location_Start_Date             = document.getElementById('New_Location_Start_Date').value;
    var New_Location_End_Date               = document.getElementById('New_Location_End_Date').value;
    var New_Location_Additional_Information = document.getElementById('New_Location_Additional_Information').value;

    var Form_Authcode                       = document.getElementById('Form_Authcode_Assistant_Location').value;

    var Location_Places_ID                  = document.getElementById('Location_Places_ID').value;
    var Location_Places_Name                = document.getElementById('Location_Places_Name').value;
    
    var Location_Places_Lat                 = document.getElementById('Location_Places_Lat').value;
    var Location_Places_Lng                 = document.getElementById('Location_Places_Lng').value;
    var Location_Places_PLZ                 = document.getElementById('Location_Places_PLZ').value;
    var Location_Places_Ortsteil            = document.getElementById('Location_Places_Ortsteil').value;
    var Location_Places_Ort                 = document.getElementById('Location_Places_Ort').value;
    var Location_Places_Land                = document.getElementById('Location_Places_Land').value;    

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/set_location.php',
        data: ( {
              Type:                                 'Location'                          ,
              
              Location_Home_Toggle:                 Location_Home_Toggle                ,

              Location_Places_ID:                   Location_Places_ID                  ,
              Location_Places_Name:                 Location_Places_Name                ,

              Set_Location_Code:                    Set_Location_Code                   ,
              Form_Authcode:                        Form_Authcode                       ,
              
              Location_Places_Lat:                  Location_Places_Lat                 ,
              Location_Places_Lng:                  Location_Places_Lng                 ,
              Location_Places_PLZ:                  Location_Places_PLZ                 ,
              Location_Places_Ortsteil:             Location_Places_Ortsteil            ,
              Location_Places_Ort:                  Location_Places_Ort                 ,
              Location_Places_Land:                 Location_Places_Land                ,

              Location_Search:                      Location_Search                     ,
              New_Location_Start_Date:              New_Location_Start_Date             ,
              New_Location_End_Date:                New_Location_End_Date               ,
              New_Location_Additional_Information:  New_Location_Additional_Information ,
              
              ZEpp_Version:                       ZEpp_Version                      ,              
              JS_Session_ID:                        JS_Session_ID                       ,

              Test:                     0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            $.mobile.loading("hide");
            console.log('Location Response correct');
          //console.log(data);
            
            window.localStorage.setItem('Holiday_completed', 1);
            
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }
        }
    });

}


function fct_toggle_location_entry(str_value) {

    if(str_value == 'yes') {

        $('#Location_Options').slideUp();

    } else if(str_value == 'no') {

        $('#Location_Options').slideDown();

    }

}


function fct_set_individual_preferences(Set_Profile_Code) {

    $("#DIV_ID_Individual_Error").html("");
    $("#DIV_ID_Individual_Error").removeClass().addClass("zepp-invisible");
    
    var Form_Authcode             = document.getElementById('Form_Authcode_Assistant_Profile').value;

    var Individual_Birthdate      = document.getElementById('Individual_Birthdate').value;
    var Individual_Firstname      = document.getElementById('Individual_Firstname').value;
    var Individual_Gender         = document.getElementById('Individual_Gender').value;
    var Individual_Language       = document.getElementById('Individual_Language').value;

    var Individual_Family_Status  = '';

    if(document.getElementById('Individual_Family_Status_Single').checked == true) {
        Individual_Family_Status = 'Single';
    } else if(document.getElementById('Individual_Family_Status_Relationship').checked == true) {
        Individual_Family_Status = 'Relationship';
    } else if(document.getElementById('Individual_Family_Status_Married').checked == true) {
        Individual_Family_Status = 'Married';
    } 

    var Individual_Kids  = '';

    if(document.getElementById('Individual_Kids_No').checked == true) {
        Individual_Kids = 'No';
    } else if(document.getElementById('Individual_Kids_Yes').checked == true) {
        Individual_Kids = 'Yes';
    } 

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/set_individual_preferences.php',
        data: ( {
              Type:                     'Individual_Information'  ,
              
              Form_Authcode:            Form_Authcode             ,
              Set_Profile_Code:         Set_Profile_Code          ,
              
              Individual_Birthdate:     Individual_Birthdate      ,
              Individual_Gender:        Individual_Gender         ,
              Individual_Language:      Individual_Language       ,
              Individual_Firstname:     Individual_Firstname      ,
              Individual_Family_Status: Individual_Family_Status  ,
              Individual_Kids:          Individual_Kids           ,

              ZEpp_Version:           ZEpp_Version            ,              
              JS_Session_ID:            JS_Session_ID             ,
              Test:                     0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            $.mobile.loading("hide");
            console.log('Individual Preferences Response correct');
            //console.log(data);

            window.localStorage.setItem('Profile_completed', 1);
            window.localStorage.setItem('Assistant_completed', 1);

            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }
        }
    });

}

// Assistant Functions
////////////////////////////////










function fct_toggle_category(Individual_ID, Category_ID) {

    $.mobile.loading("show");

    if($("#BTN_ID_Category_" + Category_ID).hasClass('ui-btn-active')) {
    
        $("#BTN_ID_Category_" + Category_ID).removeClass().addClass("ui-btn ui-btn-b");   
        
        $.ajaxQueue({
            url:  ZEpp.Settings.ServerUrl + '/_app_api/set_action.php',
            data: ( {
                  Action_Type:                          'Action_end'                ,
                  
                  Category_ID:                          Category_ID                 ,
                  
                  ZEpp_Version:                         ZEpp_Version                ,              
                  JS_Session_ID:                        JS_Session_ID               ,
    
                  Test:                                 0
            } ),
            type: 'POST',
            cache: false,
            success: function(data) {
                $.mobile.loading("hide");
                console.log('Action stopped');
                //console.log(data);
                
                //window.localStorage.setItem('Holiday_completed', 1);
                
                if($('#save_values_area')[0]) {             
                    $('#save_values_area')[0].innerHTML = data;
                    runScripts(document.getElementById('save_values_area'));
                }
            }
        });
    
    } else {
    
        var Menu_Array_Categories = $("button[id^='BTN_ID_Category_']");
        var Anz_Categories = Menu_Array_Categories.length;

        for (i = 0; i < Menu_Array_Categories.length; ++i) {                                                
            str_ID_Category = Menu_Array_Categories[i].id;
            Arr_ID_Array_Categories = str_ID_Category.split('_');
            int_ID_Category = Arr_ID_Array_Categories[3];
            //alert(int_ID_Category);
            
            $('#' + str_ID_Category).removeClass().addClass("ui-btn ui-btn-b");   
            
            $('#ACR_ID_Category_' + int_ID_Category)[0].innerHTML = '';       
            
        }
        
        $("#BTN_ID_Category_" + Category_ID).removeClass().addClass("ui-btn ui-btn-b ui-btn-active");   
        
        $.ajaxQueue({
            url:  ZEpp.Settings.ServerUrl + '/_app_api/set_action.php',
            data: ( {
                  Action_Type:                          'Action_start'              ,
                  
                  Category_ID:                          Category_ID                 ,
                  
                  ZEpp_Version:                         ZEpp_Version                ,              
                  JS_Session_ID:                        JS_Session_ID               ,
    
                  Test:                                 0
            } ),
            type: 'POST',
            cache: false,
            success: function(data) {
                $.mobile.loading("hide");
                console.log('Action started');
                //console.log(data);
                
                //window.localStorage.setItem('Holiday_completed', 1);
                
                if($('#save_values_area')[0]) {             
                    $('#save_values_area')[0].innerHTML = data;
                    runScripts(document.getElementById('save_values_area'));
                }
            }
        });

    }        

}

    



////////////////////////////////
// Navigation Helper

function fct_go_back_to_location(Action_ID_Edit) {

    str_Time = fct_make_Time();
    
    document.location.href = 'location_details.html?Timestring=' + str_Time + '&Action_ID_Edit=' + Action_ID_Edit;

}


function fct_go_back_to_locations() {

    $.mobile.navigate('my_locations.html');

}

function fct_goto_profile_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'my_profile.html?Timestring=' + str_Time;

}

function fct_goto_change_password_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'change_password.html?Timestring=' + str_Time;

}


function fct_go_back_to_locations_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'my_locations.html?Timestring=' + str_Time;
    
}


function fct_goto_home_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'application.html?Timestring=' + str_Time;
    
}


function fct_goto_origins_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'my_origins.html?Timestring=' + str_Time;
    
}

function fct_goto_locations_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'my_locations.html?Timestring=' + str_Time;
    
}

function fct_goto_communication(Other_Individual_ID) {

    str_Time = fct_make_Time();

    //alert(Other_Individual_ID);
    
    document.location.href = 'my_contacts.html?Timestring=' + str_Time + '&Add_Contact_ID=' + Other_Individual_ID;
    
}

function fct_goto_contacts_and_refresh() {

    str_Time = fct_make_Time();

    document.location.href = 'my_contacts.html?Timestring=' + str_Time;
    
}




function fct_get_to_add_location() {

    str_Time = fct_make_Time();

    document.location.href = 'add_location.html?Timestring=' + str_Time;
    
}


function fct_go_back_to_origins() {

    $.mobile.navigate('my_origins.html');

}


function fct_go_back_to_origins_and_refresh(Section_active) {

    str_Time = fct_make_Time();

    document.location.href = 'my_origins.html?Timestring=' + str_Time + '&Section=' + Section_active;
    
}


function fct_get_to_add_origin() {

    str_Time = fct_make_Time();

    document.location.href = 'add_origin.html?Timestring=' + str_Time;
    
}

// Navigation Helper
////////////////////////////////




////////////////////////////////
// Location Functions

function fct_get_locations() {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_locations.php',
        data: ( {
              Type:             'Location'          ,
              
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_My_actual_locations')[0]) {
                $('#DIV_ID_My_actual_locations')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_My_actual_locations'));
            }
        }
    });

}


function fct_get_location_single(ZIL_ID) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_location_single.php',
        data: ( {
              Type:             'Location'          ,
              ZIL_ID:           ZIL_ID              ,
              
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Location_Single')[0]) {
                $('#DIV_ID_Location_Single')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Location_Single'));
            }
        }
    });

}



function fct_get_feed() {

    $.mobile.loading("show");
    //alert('Loading Feed');

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_feed_profile.php',
        data: ( {
              Type:             'Feed'          ,
              
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            $.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_My_Feed')[0]) {
                $('#DIV_ID_My_Feed')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_My_Feed'));
            }
        }
    });

}


function fct_get_actions() {

    $.mobile.loading("show");
    //alert('Loading Feed');

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_actions.php',
        data: ( {
              Type:             'Actions'          ,
              
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            $.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Actions')[0]) {
                $('#DIV_ID_Actions')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Actions'));
            }
        }
    });

}





function fct_get_locations_profile() {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_locations_profile.php',
        data: ( {
              Type:             'Location'          ,
              
              ZEpp_Version:   ZEpp_Version      ,              
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Actual_Locations')[0]) {
                $('#DIV_ID_Actual_Locations')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Actual_Locations'));
            }
        }
    });

}



function fct_get_location_details(Action_ID_Edit) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_location_details.php',
        data: ( {
              Type:             'ZIL'           ,
              Action_ID_Edit:   Action_ID_Edit        ,
              
              ZEpp_Version:   ZEpp_Version  ,              
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Location_Details')[0]) {
                $('#DIV_ID_Location_Details')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Location_Details'));
            }
        }
    });

}



function fct_edit_location(Action_ID_Edit) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_location_edit.php',
        data: ( {
              Type:             'ZIL'           ,
              Action_ID_Edit:   Action_ID_Edit  ,
              
              ZEpp_Version:     ZEpp_Version    ,              
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Location_Edit')[0]) {
                $('#DIV_ID_Location_Edit')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Location_Edit'));
            }
        }
    });

}



function fct_update_location(ZIL_Edit, ZIL_Edit_Code) {

    $.mobile.loading("show");
    //alert(JS_Session_ID);

    var Form_Authcode                   = document.getElementById('Form_Authcode_Edit_Location').value;    
    
    var ZIL_Edit_Start_Date             = $('#ZIL_Edit_Start_Date')[0].value;
    var ZIL_Edit_End_Date               = $('#ZIL_Edit_End_Date')[0].value;
    var ZIL_Edit_Additional_Information = $('#ZIL_Edit_Additional_Information')[0].value;

    var ZIL_Edit_Start_Date  = $('#ZIL_Edit_Start_Date')[0].value;

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/update_location.php',
        data: ( {
              Type:                             'ZIL'                           ,
              
              ZIL_Edit:                         ZIL_Edit                        ,
              
              ZIL_Edit_Code:                    ZIL_Edit_Code                   ,
              Form_Authcode:                    Form_Authcode                   ,
              
              ZIL_Edit_Start_Date:              ZIL_Edit_Start_Date             ,
              ZIL_Edit_End_Date:                ZIL_Edit_End_Date               ,
              ZIL_Edit_Additional_Information:  ZIL_Edit_Additional_Information ,
              
              ZEpp_Version:                   ZEpp_Version                  ,              
              JS_Session_ID:                    JS_Session_ID                   ,
              Test:                             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            $.mobile.loading("hide");
          //console.log(data);
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }
        }
    });

}



function fct_get_assistant_step_1() {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_assistant_home_request.php',
        data: ( {
              Type:             'Location'          ,
              
              ZEpp_Version:   ZEpp_Version      ,                           
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Assistant_Home')[0]) {
                $('#DIV_ID_Assistant_Home')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Assistant_Home'));
            }
        }
    });

}



function fct_get_assistant_step_2() {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_assistant_holiday_request.php',
        data: ( {
              Type:             'Holiday'         ,

              ZEpp_Version:   ZEpp_Version    ,                                         
              JS_Session_ID:    JS_Session_ID     ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Assistant_Holiday')[0]) {
                $('#DIV_ID_Assistant_Holiday')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Assistant_Holiday'));
            }
        }
    });

}


function fct_get_assistant_step_3() {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_assistant_profile_request.php',
        data: ( {
              Type:             'Holiday'         ,
              
              ZEpp_Version:   ZEpp_Version    ,                                                       
              JS_Session_ID:    JS_Session_ID     ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Assistant_Profile')[0]) {
                $('#DIV_ID_Assistant_Profile')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Assistant_Profile'));
            }
        }
    });

}

function fct_request_change_password_form() {
    
    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/change_password_request.php',
        data: ( {
              Type:             'Password'        ,
              
              ZEpp_Version:   ZEpp_Version    ,                                                       
              JS_Session_ID:    JS_Session_ID     ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Password_Change')[0]) {
                $('#DIV_ID_Password_Change')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Password_Change'));
            }
        }
    });

}


function fct_request_add_location_form() {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_location_form_request.php',
        data: ( {
              Type:             'Location'          ,
              
              ZEpp_Version:   ZEpp_Version      ,                                                       
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Location_Add')[0]) {
                $('#DIV_ID_Location_Add')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Location_Add'));
            }
        }
    });

}





function fct_save_location_form(ZIL_Add_Code, Page_Source) {
    
    if(Page_Source=="Manual") {
        $("#DIV_ID_Add_Location_Error").html("");
        $("#DIV_ID_Add_Location_Error").removeClass().addClass("zepp-invisible");
    } else if(Page_Source=="QRCode") {
        $("#DIV_ID_Add_Location_Barcode_Error").html("");
        $("#DIV_ID_Add_Location_Barcode_Error").removeClass().addClass("zepp-invisible");
    }
    
    if(Page_Source=="Manual") {
    
        var Location_Search                     = document.getElementById('Location_Search').value;
        var New_Location_Start_Date             = document.getElementById('New_Location_Start_Date').value;
        var New_Location_End_Date               = document.getElementById('New_Location_End_Date').value;
        var New_Location_Additional_Information = document.getElementById('New_Location_Additional_Information').value;
    
        var Form_Authcode                       = document.getElementById('Form_Authcode_Add_Location').value;
        
        var Location_Places_ID                  = document.getElementById('Location_Places_ID').value;
        var Location_Places_Name                = document.getElementById('Location_Places_Name').value;
    
        var Location_Places_Lat                 = document.getElementById('Location_Places_Lat').value;
        var Location_Places_Lng                 = document.getElementById('Location_Places_Lng').value;
        var Location_Places_PLZ                 = document.getElementById('Location_Places_PLZ').value;
        var Location_Places_Ortsteil            = document.getElementById('Location_Places_Ortsteil').value;
        var Location_Places_Ort                 = document.getElementById('Location_Places_Ort').value;
        var Location_Places_Land                = document.getElementById('Location_Places_Land').value;
        
        var New_Location_Location_FID = 0;
        var New_Location_Add_Code     = "";
        
    } else {
        
        var Location_Search                     = '';
        
        var New_Location_Start_Date             = document.getElementById('New_Location_Start_Date').value;
        var New_Location_End_Date               = document.getElementById('New_Location_End_Date').value;
        var New_Location_Additional_Information = document.getElementById('New_Location_Additional_Information').value;
    
        var Form_Authcode                       = document.getElementById('Form_Authcode_Add_Location_Barcode').value;
        
        var New_Location_Location_FID           = document.getElementById('New_Location_Location_FID').value;
        var New_Location_Add_Code               = document.getElementById('New_Location_Add_Code').value;
    
        var Location_Places_ID                  = '';
        var Location_Places_Name                = '';
    
        var Location_Places_Lat                 = '';
        var Location_Places_Lng                 = '';
        var Location_Places_PLZ                 = '';
        var Location_Places_Ortsteil            = '';
        var Location_Places_Ort                 = '';
        var Location_Places_Land                = '';

        
    }

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_location.php',
        data: ( {
              Type:                                 'Location'                          ,
                            
              Form_Authcode:                        Form_Authcode                       ,
              ZIL_Add_Code:                         ZIL_Add_Code                        ,
              
              New_Location_Location_FID:            New_Location_Location_FID           ,
              New_Location_Add_Code:                New_Location_Add_Code               ,
              Page_Source:                          Page_Source                         ,

              Location_Places_ID:                   Location_Places_ID                  ,
              Location_Places_Name:                 Location_Places_Name                ,

              Location_Places_Lat:                  Location_Places_Lat                 ,
              Location_Places_Lng:                  Location_Places_Lng                 ,
              Location_Places_PLZ:                  Location_Places_PLZ                 ,
              Location_Places_Ortsteil:             Location_Places_Ortsteil            ,
              Location_Places_Ort:                  Location_Places_Ort                 ,
              Location_Places_Land:                 Location_Places_Land                ,

              Location_Search:                      Location_Search                     ,
              New_Location_Start_Date:              New_Location_Start_Date             ,
              New_Location_End_Date:                New_Location_End_Date               ,
              New_Location_Additional_Information:  New_Location_Additional_Information ,

              ZEpp_Version:                       ZEpp_Version                      ,                                                                     
              JS_Session_ID:                        JS_Session_ID                       ,              
              Test:                                 0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            $.mobile.loading("hide");
            console.log('Location Add Response correct');
          //console.log(data);
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }
        }
    });

}


function fct_delete_location(ZIL_Delete, ZIL_Delete_Code) {

    $.mobile.loading("show");

    //alert(JS_Session_ID);
    //var Antwort = fct_areyousure('Are you sure that you want to delete this vacation from your history?');
    
    var Form_Authcode_Delete = document.getElementById('Form_Authcode_Delete_Location').value;        

    //if(Antwort==true) {

        $.ajaxQueue({
            url:  ZEpp.Settings.ServerUrl + '/_app_api/delete_location.php',
            data: ( {
                  Type:                 'ZIL'                 ,
                  
                  ZIL_Delete:           ZIL_Delete            ,
                  ZIL_Delete_Code:      ZIL_Delete_Code       ,
                  Form_Authcode_Delete: Form_Authcode_Delete  ,
                  
                  ZEpp_Version:       ZEpp_Version        ,                                                                     
                  JS_Session_ID:        JS_Session_ID         ,                  
                  Test:                 0
            } ),
            type: 'POST',
            cache: false,
            success: function(data) {
              //console.log('Treffer');
                $.mobile.loading("hide");
              //console.log(data);
                if($('#save_values_area')[0]) {
                    $('#save_values_area')[0].innerHTML = data;
                    runScripts(document.getElementById('save_values_area'));
                }
                
            }
        });

    //} else {        
        //$.mobile.loading("hide");
    //}

}

// Location Functions
////////////////////////////////



////////////////////////////////
// Origin Functions


function fct_show_Origin_selection(str_DIV_ID) {
      
     fct_hide_DIV_direct('DIV_ID_Add_Home_Origin');
     fct_hide_DIV_direct('DIV_ID_Add_Work_Origin');
     fct_hide_DIV_direct('DIV_ID_Add_Interest_Origin');
     
     $("#DIV_ID_Add_Origin_Error_1").html("");
     $("#DIV_ID_Add_Origin_Error_2").html("");
     $("#DIV_ID_Add_Origin_Error_3").html("");
     
     $("#DIV_ID_Add_Origin_Error_1").removeClass().addClass("zepp-invisible");
     $("#DIV_ID_Add_Origin_Error_2").removeClass().addClass("zepp-invisible");
     $("#DIV_ID_Add_Origin_Error_3").removeClass().addClass("zepp-invisible");
     
     fct_show_DIV(str_DIV_ID);          
                  
}


function fct_get_origins(Target_Lat, Target_Lng) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_origins.php',
        data: ( {
              Type:             'Origin'            ,
              
              Target_Lat:       Target_Lat          ,
              Target_Lng:       Target_Lng          ,

              ZEpp_Version:   ZEpp_Version      ,                                                                                       
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_My_actual_origins')[0]) {
                $('#DIV_ID_My_actual_origins')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_My_actual_origins'));
            }
        }
    });

}

function fct_get_options(Return_to_Page) {

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_options.php',
        data: ( {
              Type:             'Origin'            ,
              
              ZEpp_Version:   ZEpp_Version      ,                                                                                                     
              JS_Session_ID:    JS_Session_ID       ,
              
              Return_to_Page:   Return_to_Page      ,
              
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_My_search_options')[0]) {
                $('#DIV_ID_My_search_options')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_My_search_options'));
            }
        }
    });

}



function fct_get_origins_profile(Origin_Type) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_origins_profile.php',
        data: ( {
              Type:             'Origin'            ,
              Origin_Type:      Origin_Type         ,
              
              ZEpp_Version:   ZEpp_Version      ,                                                                                                     
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_All_' + Origin_Type + '_Origins')[0]) {
                $('#DIV_ID_All_' + Origin_Type + '_Origins')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_All_' + Origin_Type + '_Origins'));
            }
        }
    });

}



function fct_edit_origin(ZIO_Edit) {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/get_origin_edit.php',
        data: ( {
              Type:             'ZIO'           ,
              ZIO_Edit:         ZIO_Edit        ,
              
              ZEpp_Version:   ZEpp_Version  ,                                                                                                                   
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            if($('#DIV_ID_Origin_Edit')[0]) {
                $('#DIV_ID_Origin_Edit')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Origin_Edit'));
            }
        }
    });

}



function fct_update_origin(ZIO_Edit, ZIO_Edit_Code, Section_active) {

    $.mobile.loading("show");
    //alert(JS_Session_ID);
    
    var Form_Authcode                   = document.getElementById('Form_Authcode_Edit_Origin').value;
    
    var ZIO_Edit_Start_Date             = $('#ZIO_Edit_Start_Date')[0].value;
    var ZIO_Edit_End_Date               = $('#ZIO_Edit_End_Date')[0].value;
    var ZIO_Edit_Additional_Information = $('#ZIO_Edit_Additional_Information')[0].value;
    var ZIO_Edit_No_End_Date            = $('#ZIO_Edit_No_End_Date')[0].checked;
    var ZIO_Edit_Start_Date  = $('#ZIO_Edit_Start_Date')[0].value;

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/update_origin.php',
        data: ( {
              Type:                             'ZIO'                           ,
              ZIO_Edit:                         ZIO_Edit                        ,
              ZIO_Edit_Code:                    ZIO_Edit_Code                   ,
              Form_Authcode:                    Form_Authcode                   ,
              Section_active:                   Section_active                  ,
              
              ZIO_Edit_Start_Date:              ZIO_Edit_Start_Date             ,
              ZIO_Edit_No_End_Date:             ZIO_Edit_No_End_Date            ,
              ZIO_Edit_End_Date:                ZIO_Edit_End_Date               ,
              ZIO_Edit_Additional_Information:  ZIO_Edit_Additional_Information ,

              ZEpp_Version:                   ZEpp_Version                  ,                                                                                                                                 
              JS_Session_ID:                    JS_Session_ID                   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            $.mobile.loading("hide");
          //console.log(data);
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }            
        }
    });

}



function fct_request_add_origin_form() {

    //$.mobile.loading("show");
    //alert(JS_Session_ID);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_origin_form_request.php',
        data: ( {
              Type:             'Origin'        ,
              
              ZEpp_Version:   ZEpp_Version  ,                                                                                                                                 
              JS_Session_ID:    JS_Session_ID   ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
          //console.log('Treffer');
            //console.log(data);
            if($('#DIV_ID_Origin_Add')[0]) {
                $('#DIV_ID_Origin_Add')[0].innerHTML = data;
                runScripts(document.getElementById('DIV_ID_Origin_Add'));
            }
        }
    });

}








function fct_save_origin_form(ZIO_Add_Code, Return_Section, str_language, Page_Source) {

    if(Page_Source=="Manual") {
        $("#DIV_ID_Add_Origin_Error").html("");
        $("#DIV_ID_Add_Origin_Error").removeClass().addClass("zepp-invisible");
    } else if(Page_Source=="QRCode") {
        $("#DIV_ID_Add_Origin_Error").html("");
        $("#DIV_ID_Add_Origin_Error").removeClass().addClass("zepp-invisible");
    }
    
    var Origin_Type = 0;
    
    if(Page_Source=="Manual") {
    
        if(document.getElementById('Origin_Type_1').checked == true) {
            Origin_Type = 1;
        } else if(document.getElementById('Origin_Type_2').checked == true) {
            Origin_Type = 2;
        } else if(document.getElementById('Origin_Type_3').checked == true) {
            Origin_Type = 3;
        } else {    
            if(str_language=="de") {
                $("#DIV_ID_Origin_Error").html("<p>Bitte w&auml;hle einen Herkunftstyp aus.</p>");
                $("#DIV_ID_Origin_Error").addClass("zepp-ctn-err").slideDown();
            } else {
                $("#DIV_ID_Origin_Error").html("<p>Please choose a Root Type.</p>");
                $("#DIV_ID_Origin_Error").addClass("zepp-ctn-err").slideDown();
            }
            return;
        }
    
    } else if(Page_Source=="QRCode") {
        Origin_Type = document.getElementById('INPUT_ID_Origin_Type_QRCode').value;
    }
    
    
    if(Page_Source=="Manual") {
        var Form_Authcode                         = document.getElementById('Form_Authcode_Add_Origin').value;    
    } else if(Page_Source=="QRCode") {
        var Form_Authcode                         = document.getElementById('Form_Authcode_Add_Origin_Barcode').value;    
    }
    
    
    if(Page_Source=="Manual") {
        
        if(Origin_Type==1) {
        
            var New_Origin_Search                 = document.getElementById('New_Home_Origin_Search').value;        
            //var New_Origin_Start_Year             = document.getElementById('New_Home_Origin_Start_Year').value;
            //var New_Origin_Start_Month            = document.getElementById('New_Home_Origin_Start_Month').value;
            var New_Origin_Start_Date             = document.getElementById('New_Home_Origin_Start_Date').value;
            var New_Origin_No_End_Date            = document.getElementById('New_Home_Origin_No_End_Date').checked;
            //var New_Origin_End_Year             = document.getElementById('New_Home_Origin_End_Year').value;
            //var New_Origin_End_Month            = document.getElementById('New_Home_Origin_End_Month').value;
            var New_Origin_End_Date               = document.getElementById('New_Home_Origin_End_Date').value;
            var New_Origin_Additional_Information = document.getElementById('New_Home_Origin_Additional_Information').value;    
            
            var Origin_Places_ID                  = document.getElementById('Origin_Places_ID').value;
            var Origin_Places_Name                = document.getElementById('Origin_Places_Name').value;
        
            var Origin_Places_Lat                 = document.getElementById('Origin_Places_Lat').value;
            var Origin_Places_Lng                 = document.getElementById('Origin_Places_Lng').value;
            var Origin_Places_PLZ                 = document.getElementById('Origin_Places_PLZ').value;
            var Origin_Places_Ortsteil            = document.getElementById('Origin_Places_Ortsteil').value;
            var Origin_Places_Ort                 = document.getElementById('Origin_Places_Ort').value;
            var Origin_Places_Land                = document.getElementById('Origin_Places_Land').value;
    
        } else if(Origin_Type==2) {
            
            var New_Origin_Search                 = document.getElementById('New_Work_Origin_Search').value;
            //var New_Origin_Start_Year             = document.getElementById('New_Work_Origin_Start_Year').value;
            //var New_Origin_Start_Month            = document.getElementById('New_Work_Origin_Start_Month').value;
            var New_Origin_Start_Date             = document.getElementById('New_Work_Origin_Start_Date').value;
            var New_Origin_No_End_Date            = document.getElementById('New_Work_Origin_No_End_Date').checked;
            //var New_Origin_End_Year               = document.getElementById('New_Work_Origin_End_Year').value;
            //var New_Origin_End_Month              = document.getElementById('New_Work_Origin_End_Month').value;
            var New_Origin_End_Date               = document.getElementById('New_Work_Origin_End_Date').value;
            var New_Origin_Additional_Information = document.getElementById('New_Work_Origin_Additional_Information').value;
            
            var Origin_Places_ID                  = document.getElementById('Origin_Places_ID').value;
            var Origin_Places_Name                = document.getElementById('Origin_Places_Name').value;
        
            var Origin_Places_Lat                 = document.getElementById('Origin_Places_Lat').value;
            var Origin_Places_Lng                 = document.getElementById('Origin_Places_Lng').value;
            var Origin_Places_PLZ                 = document.getElementById('Origin_Places_PLZ').value;
            var Origin_Places_Ortsteil            = document.getElementById('Origin_Places_Ortsteil').value;
            var Origin_Places_Ort                 = document.getElementById('Origin_Places_Ort').value;
            var Origin_Places_Land                = document.getElementById('Origin_Places_Land').value;
                
        } else if(Origin_Type==3) {
            
            var New_Origin_Search                 = document.getElementById('New_Interest_Origin_Search').value;
            //var New_Origin_Start_Year             = document.getElementById('New_Interest_Origin_Start_Year').value;
            //var New_Origin_Start_Month            = document.getElementById('New_Interest_Origin_Start_Month').value;
            var New_Origin_Start_Date             = document.getElementById('New_Interest_Origin_Start_Date').value;
            var New_Origin_No_End_Date            = document.getElementById('New_Interest_Origin_No_End_Date').checked;
            //var New_Origin_End_Year               = document.getElementById('New_Interest_Origin_End_Year').value;
            //var New_Origin_End_Month              = document.getElementById('New_Interest_Origin_End_Month').value;
            var New_Origin_End_Date               = document.getElementById('New_Interest_Origin_End_Date').value;
            var New_Origin_Additional_Information = document.getElementById('New_Interest_Origin_Additional_Information').value;
            
            var Origin_Places_ID                  = document.getElementById('Origin_Places_ID').value;
            var Origin_Places_Name                = document.getElementById('Origin_Places_Name').value;
        
            var Origin_Places_Lat                 = document.getElementById('Origin_Places_Lat').value;
            var Origin_Places_Lng                 = document.getElementById('Origin_Places_Lng').value;
            var Origin_Places_PLZ                 = document.getElementById('Origin_Places_PLZ').value;
            var Origin_Places_Ortsteil            = document.getElementById('Origin_Places_Ortsteil').value;
            var Origin_Places_Ort                 = document.getElementById('Origin_Places_Ort').value;
            var Origin_Places_Land                = document.getElementById('Origin_Places_Land').value;
    
        }    
        
        var New_Origin_Origin_FID = 0;
        var New_Origin_Add_Code   = "";
        
    } else if(Page_Source=="QRCode") {
        
        var Origin_Places_ID                  = '';
        var Origin_Places_Name                = '';
    
        var Origin_Places_Lat                 = '';
        var Origin_Places_Lng                 = '';
        var Origin_Places_PLZ                 = '';
        var Origin_Places_Ortsteil            = '';
        var Origin_Places_Ort                 = '';
        var Origin_Places_Land                = '';
    
        var New_Origin_Origin_FID             = document.getElementById('New_Origin_Origin_FID').value;
        var New_Origin_Add_Code               = document.getElementById('New_Origin_Add_Code').value;
        
        var New_Origin_Start_Date             = document.getElementById('New_Origin_Start_Date').value;
        var New_Origin_No_End_Date            = document.getElementById('New_Origin_No_End_Date').checked;
        var New_Origin_End_Date               = document.getElementById('New_Origin_End_Date').value;
        var New_Origin_Additional_Information = document.getElementById('New_Origin_Additional_Information').value;        

    }

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/add_origin.php',
        data: ( {
              Type:                               'Origin'                          ,
              
              Form_Authcode:                      Form_Authcode                     ,
              ZIO_Add_Code:                       ZIO_Add_Code                      ,

              Page_Source:                        Page_Source                       ,              
              QR_Origin_Add_Code:                 New_Origin_Add_Code               ,
              QR_Origin_Origin_FID:               New_Origin_Origin_FID             ,
              
              Origin_Type:                        Origin_Type                       ,
              Origin_Places_ID:                   Origin_Places_ID                  ,
              Origin_Places_Name:                 Origin_Places_Name                ,

              Origin_Places_Lat:                  Origin_Places_Lat                 ,
              Origin_Places_Lng:                  Origin_Places_Lng                 ,
              Origin_Places_PLZ:                  Origin_Places_PLZ                 ,
              Origin_Places_Ortsteil:             Origin_Places_Ortsteil            ,
              Origin_Places_Ort:                  Origin_Places_Ort                 ,
              Origin_Places_Land:                 Origin_Places_Land                ,

              New_Origin_Search:                  New_Origin_Search                 ,
              //New_Origin_Start_Year:              New_Origin_Start_Year             ,
              //New_Origin_Start_Month:             New_Origin_Start_Month            ,
              New_Origin_Start_Date:              New_Origin_Start_Date             ,
              New_Origin_No_End_Date:             New_Origin_No_End_Date            ,
              //New_Origin_End_Year:                New_Origin_End_Year               ,
              //New_Origin_End_Month:               New_Origin_End_Month              ,
              New_Origin_End_Date:                New_Origin_End_Date               ,
              New_Origin_Additional_Information:  New_Origin_Additional_Information ,
              
              Return_Section:                     Return_Section                    ,
              
              ZEpp_Version:                     ZEpp_Version                    ,                                                                                                                                                             
              JS_Session_ID:                      JS_Session_ID                     ,
              Test:                     0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            $.mobile.loading("hide");
            console.log('Origin Add Response correct');
          //console.log(data);
            if($('#save_values_area')[0]) {             
                $('#save_values_area')[0].innerHTML = data;
                runScripts(document.getElementById('save_values_area'));
            }            
        }
    });

}


function fct_delete_origin(ZIO_Delete, ZIO_Delete_Code, Section_active) {

    $.mobile.loading("show");

    var Form_Authcode_Delete = document.getElementById('Form_Authcode_Delete_Origin').value;        
    
    //alert(JS_Session_ID);
    //var Antwort = fct_areyousure('Are you sure that you want to delete this root from your history?');

    //if(Antwort==true) {

        $.ajaxQueue({
            url:  ZEpp.Settings.ServerUrl + '/_app_api/delete_origin.php',
            data: ( {
                  Type:                 'ZIO'                 ,
                                    
                  ZIO_Delete:           ZIO_Delete            ,
                  Section_active:       Section_active        ,
                  
                  ZIO_Delete_Code:      ZIO_Delete_Code       ,
                  Form_Authcode_Delete: Form_Authcode_Delete  ,
                  
                  ZEpp_Version:       ZEpp_Version        ,  
                  JS_Session_ID:        JS_Session_ID         ,
                  Test:                 0
            } ),
            type: 'POST',
            cache: false,
            success: function(data) {
                //console.log('Treffer');
                $.mobile.loading("hide");
                //console.log(data);
                if($('#save_values_area')[0]) {
                    $('#save_values_area')[0].innerHTML = data;
                    runScripts(document.getElementById('save_values_area'));
                }
                
            }
        });

    //}

}

// Origin Functions
////////////////////////////////



///////////////////////////////
// ZEpp Functions


function fct_logout_ZEpp() {

    console.log('Logout Attempt received');
    
    ZEpp.Session.getInstance().set({
    });
    
    document.location.href = 'index.html';
    

}

function fct_toggle_location_markers(Location_ID) {

    $.mobile.loading("show");

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/toggle_location_markers.php',
        data: ( {
              Type:             'Location'          ,
              Location_ID:      Location_ID         ,

              ZEpp_Version:   ZEpp_Version      ,                    
              JS_Session_ID:    JS_Session_ID       ,
              Test:             0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            //console.log('Treffer');
            $.mobile.loading("hide");
            //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));
        }
    });

}


function fct_drop_origin_markers(Target_Lat, Target_Lng, From_Datetime, To_Datetime) {

    $.mobile.loading("show");
    
    //alert(Target_Lat);
    //alert(Target_Lng);
    //alert(From_Datetime);
    //alert(To_Datetime);
        
    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/drop_origin_markers.php',
        data: ( {
              Type:                       'Origin'        ,
              
              Target_Lat:                 Target_Lat      ,
              Target_Lng:                 Target_Lng      ,
              From_Datetime:              From_Datetime   ,
              To_Datetime:                To_Datetime     ,

              ZEpp_Version:             ZEpp_Version  ,                    
              JS_Session_ID:              JS_Session_ID   ,              
              Test:                       0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            //console.log('Treffer');
            $.mobile.loading("hide");
            //console.log(data);
            $('#DIV_ID_Location_Single')[0].innerHTML = data;
            runScripts(document.getElementById('DIV_ID_Location_Single'));
        }
    });

}


function fct_toggle_origin_markers(Origin_ID, ZIO_ID, Target_Lat, Target_Lng) {

    //$.mobile.loading("show");
    
    var bln_checked = $('#See_Origin_' + ZIO_ID)[0].checked;
    var init_dropped = JS_Marker_already_dropped['Origin_' + ZIO_ID];
    
    //alert(marker_Groups['Origin_' + Origin_ID]);
    
    if(marker_Groups['Origin_' + ZIO_ID]==undefined) {
        marker_Groups['Origin_' + ZIO_ID] = new Array();
    }
    
    //alert(marker_Groups['Origin_' + Origin_ID]);
        
    //alert(bln_checked);
    //alert(init_dropped);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/toggle_origin_markers.php',
        data: ( {
              Type:                       'Origin'        ,
              
              Origin_ID:                  Origin_ID       ,
              ZIO_ID:                     ZIO_ID          ,
              Target_Lat:                 Target_Lat      ,
              Target_Lng:                 Target_Lng      ,
              PHP_Marker_already_dropped: init_dropped    ,
              bln_checked:                bln_checked     ,

              ZEpp_Version:             ZEpp_Version  ,                    
              JS_Session_ID:              JS_Session_ID   ,              
              Test:                       0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            //console.log('Treffer');
            //$.mobile.loading("hide");
          //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));
        }
    });

}



function fct_toggle_origin_markers_multiselect(Origin_ID, ZIO_ID) {
            
    //$.mobile.loading("show");
    
    var bln_selected = $('#See_Origin_' + ZIO_ID)[0].selected;
    var init_dropped = JS_Marker_already_dropped['Origin_' + ZIO_ID];
    
    //alert(marker_Groups['Origin_' + Origin_ID]);
    
    if(marker_Groups['Origin_' + ZIO_ID]==undefined) {
        marker_Groups['Origin_' + ZIO_ID] = new Array();
    }
    
    //alert(marker_Groups['Origin_' + Origin_ID]);
        
    //alert(bln_selected);
    //alert(init_dropped);

    $.ajaxQueue({
        url:  ZEpp.Settings.ServerUrl + '/_app_api/toggle_origin_markers.php',
        data: ( {
              Type:                       'Origin'       ,
              
              Origin_ID:                  Origin_ID      ,
              ZIO_ID:                     ZIO_ID         ,
              PHP_Marker_already_dropped: init_dropped   ,
              bln_checked:                bln_selected   ,

              ZEpp_Version:             ZEpp_Version ,                                  
              JS_Session_ID:              JS_Session_ID  ,              
              Test:                       0
        } ),
        type: 'POST',
        cache: false,
        success: function(data) {
            //console.log('Treffer');
            //$.mobile.loading("hide");
            //console.log(data);
            $('#save_values_area')[0].innerHTML = data;
            runScripts(document.getElementById('save_values_area'));
        }
    });

}

// ZEpp Functions
///////////////////////////////



















function fct_debug(DIV_ID_Name) {

    $('#' + DIV_ID_Name)[0].style.display = 'block';

}



function fct_make_Time() {

    var d1 = new Date();

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

    return str_time;
}



function fct_toggle_DIV_by_checkbox(DIV_ID, DIV_ID_Checkbox) {
    
    if($('#' + DIV_ID)[0]) {
        
        if($('#' + DIV_ID_Checkbox)[0].checked == true) {
            $('#' + DIV_ID).slideUp();
        } else {
            $('#' + DIV_ID).slideDown();
        }
    
    }

}



function fct_toggle_DIV(DIV_ID) {
    
    if($('#' + DIV_ID)[0]) {
        
        if($('#' + DIV_ID)[0].style.display == 'none') {
            $('#' + DIV_ID).slideDown();
        } else {
            $('#' + DIV_ID).slideUp();
        }
    
    }

}

function fct_show_DIV(DIV_ID) {
    
    if($('#' + DIV_ID)[0]) {
        
        $('#' + DIV_ID).slideDown();
        
    }

}

function fct_hide_DIV(DIV_ID) {
    
    if($('#' + DIV_ID)[0]) {
        
        $('#' + DIV_ID).slideUp();        
    
    }

}

function fct_hide_DIV_direct(DIV_ID) {
    
    if($('#' + DIV_ID)[0]) {
        
        $('#' + DIV_ID)[0].style.display = 'none';        
    
    }

}


function fct_areyousure(str_Text) {

    var Antwort = confirm(str_Text);

    if(Antwort == true) {
        return true;
    } else {
        return false;
    }

}

function runScripts(e) {

    if (e.nodeType != 1) return; //if it's not an element node, return

    if (e.tagName.toLowerCase() == 'script') {
        //alert(e.text);
        eval(e.text); //run the script

    } else {
        var n = e.firstChild;
        while (n) {
            if (n.nodeType == 1) runScripts(n); //if it's an element node, recurse
            n = n.nextSibling;
        }
    }

}


/*
jQuery(function(jQuery) {
    jQuery.datepicker.regional['de'] = {
        clearText: 'löschen',
        clearStatus: 'aktuelles Datum löschen',
        closeText: 'schließen',
        closeStatus: 'ohne Änderungen schließen',
        prevText: '<zurück',
        nextText: 'Vor>',
        nextStatus: 'nächsten Monat zeigen',
        currentText: 'heute',
        currentStatus: '',
        monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
        monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun', 'Jul','Aug','Sep','Okt','Nov','Dez'],
        monthStatus: 'anderen Monat anzeigen',
        yearStatus: 'anderes Jahr anzeigen',
        weekHeader: 'Wo',
        weekStatus: 'Woche des Monats',
        dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
        dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
        dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
        dayStatus: 'Setze DD als ersten Wochentag', dateStatus: 'Wähle D, M d',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        initStatus: 'Wähle ein Datum', isRTL: false
    };

    jQuery.datepicker.setDefaults(jQuery.datepicker.regional['de']);

});
 */


if(JS_Code_Online==1) {
    if(jQuery.datepicker) {
        $.datepicker.setDefaults({
            dateFormat: 'dd-M-yy'
        });
    }
}




function Checkreturn() {
    if(event.keyCode == 13) {return false;}
}




function js_number_format(number, laenge) {

    var sep = '.';
    var th_sep = '.';

    number = Math.round( number * Math.pow(10, laenge) ) / Math.pow(10, laenge);
    str_number = number+"";
    arr_int = str_number.split('.');
    if(!arr_int[0]) arr_int[0] = '0';
    if(!arr_int[1]) arr_int[1] = '';
    if(arr_int[1].length < laenge){
      nachkomma = arr_int[1];
      for(i=arr_int[1].length+1; i <= laenge; i++){  nachkomma += '0';  }
      arr_int[1] = nachkomma;
    }
    if(th_sep != '' && arr_int[0].length > 3){
      Begriff = arr_int[0];
      arr_int[0] = '';
      for(j = 3; j < Begriff.length ; j+=3){
        Extrakt = Begriff.slice(Begriff.length - j, Begriff.length - j + 3);
        arr_int[0] = th_sep + Extrakt +  arr_int[0] + '';
      }
      str_first = Begriff.substr(0, (Begriff.length % 3 == 0)?3:(Begriff.length % 3));
      arr_int[0] = str_first + arr_int[0];
    }
    return arr_int[0]+sep+arr_int[1];

}



function fct_js_runde(str_Input, Dezimalstellen) {

    //var txt_Wert = String(str_Input);
    //txt_Wert = trim(txt_Wert);
    txt_Wert = '' + str_Input + '';

    //alert(txt_Wert);

    if(txt_Wert.substring(0,1) == '-') {
        var Minus = 1;
        txt_Wert = txt_Wert.substring(1,txt_Wert.length);
        txt_Wert = trim(txt_Wert);
        //alert(txt_Wert);
    } else {
        var Minus = 0;
    }

    var arr_Teile = txt_Wert.split('.');
    var Zeichenkette = arr_Teile[0];
    var Dezimal = arr_Teile[1];

    if(Dezimal==undefined) {
        Dezimal='0';
    }
    //alert(Zeichenkette);
    //alert(Dezimal);

    var Laenge = parseInt(Zeichenkette.length);
    //alert(Laenge);
    var Zeichenkette_F = '';

    if(Laenge>3) {

        for(i = Laenge-1; i>=0; i--) {
            //alert(i);
            var Teilbar = i % 3;
            //alert(Teilbar);

            if(Teilbar==0) {
                //alert(i);
                Zeichenkette_F += Zeichenkette.substring(Laenge - i -3, Laenge - i) ;
                if(i>0) {
                    Zeichenkette_F += '.';
                }
            }

            //alert(Zeichenkette_F);
        }

    } else {

        Zeichenkette_F = Zeichenkette;

    }

    //alert(Zeichenkette_F);

    if(Dezimal=='0') {
        var appendix = '';
    } else if(Dezimalstellen=='0') {
        var appendix = '';
    } else {
        var Dezimal_F = Dezimal.substring(0, Dezimalstellen);
        var appendix = '.' + Dezimal_F;
    }

    if(Minus==1) {
        var str_Returnstring = '-' + Zeichenkette_F + appendix;
    } else {
        var str_Returnstring = Zeichenkette_F + appendix;
    }



    return str_Returnstring;

}


function findPos(obj) {

    var pos = { x:0, y:0 };

    if(obj.offsetParent) {
        while(obj.offsetParent) {
            pos.x += obj.offsetLeft;
            pos.y += obj.offsetTop;
            obj = obj.offsetParent; //definiert obj als eigenen Parent, so dass die Schleife bis zum obersten Parent durchlaufen wird
        }
    } else if(obj.x) {
        pos.x = obj.x;
    } else if(obj.y) {
        pos.y = obj.y;
    }
    return pos;
}


function SetEnd(Input_ID) {
    var input = $('#' + Input_ID);
    var len = input.val().length;
    input[0].focus();
    input[0].setSelectionRange(len, len);

}


(function($) {

// jQuery on an empty object, we are going to use this as our Queue
var ajaxQueue = $({});
$.ajaxQueue = function( ajaxOpts ) {
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();

    // queue our ajax request
    ajaxQueue.queue( doRequest );

    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }

        // if there wasn't already a jqXHR we need to remove from queue
        var queue = ajaxQueue.queue(),
            index = $.inArray( doRequest, queue );

        if ( index > -1 ) {
            queue.splice( index, 1 );
        }

        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts,
            [ promise, statusText, "" ] );

        return promise;

    };

    // run the actual query
    function doRequest( next ) {
        jqXHR = $.ajax( ajaxOpts )
            .done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }
    return promise;
};

})(jQuery);