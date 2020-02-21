
var ZEpp = ZEpp || {};

ZEpp.RegisterController = function () {

    this.$RegisterPage          = null;
    this.$btnSubmit             = null;
    this.$txtFirstName          = null;
    this.$txtEmailAddress       = null;
    this.$txtPassword           = null;
    this.$txtPassword_2         = null;    
    this.$ctnErr                = null;
    this.PageIDRegisterSuccess  = null;
    
};



ZEpp.RegisterController.prototype.init = function () {

    console.log('RegisterController init');
    
    this.$RegisterPage          = $("#PAGE_ID_Register");
    this.$btnSubmit             = $("#BTN_ID_Register"                  , this.$RegisterPage);    
    this.$txtFirstName          = $("#ZEpp_Form_Register_Firstname"   , this.$RegisterPage);
    this.$txtEmailAddress       = $("#ZEpp_Form_Register_Username"    , this.$RegisterPage);    
    this.$txtPassword           = $("#ZEpp_Form_Register_Password"    , this.$RegisterPage);
    this.$txtPassword_2         = $("#ZEpp_Form_Register_Password_2"  , this.$RegisterPage);
    this.$ctnErr                = $("#DIV_ID_Register_Error"            , this.$RegisterPage);
    this.PageIDRegisterSuccess  = "#PAGE_ID_Register_Successful";
    
};


ZEpp.RegisterController.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


ZEpp.RegisterController.prototype.resetRegisterForm = function () {

    var invisibleStyle    = "zepp-invisible",
        invalidInputStyle = "zepp-invalid-input";
    
    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
        
    this.$txtFirstName.removeClass(invalidInputStyle);
    this.$txtEmailAddress.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
    this.$txtPassword_2.removeClass(invalidInputStyle);
    
    this.$txtFirstName.val("");
    this.$txtEmailAddress.val("");
    this.$txtPassword.val("");
    this.$txtPassword_2.val("");
    
};


ZEpp.RegisterController.prototype.onRegisterCommand = function () {

    var me                  = this,
        firstName           = me.$txtFirstName.val().trim(),
        emailAddress        = me.$txtEmailAddress.val().trim(),
        password            = me.$txtPassword.val().trim(),
        password_2          = me.$txtPassword_2.val().trim(),
        invalidInput        = false,
        PasswordsDoNotMatch = false, 
        invisibleStyle      = "zepp-invisible",
        invalidInputStyle   = "zepp-invalid-input";
    
    
    // Reset styles.    
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$ctnErr.html("");
    
    me.$txtFirstName.removeClass(invalidInputStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
    me.$txtPassword_2.removeClass(invalidInputStyle);    
    
    // Flag each invalid field.
    if (firstName.length === 0) {
        me.$txtFirstName.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    if (password != password_2) {
        me.$txtPassword_2.addClass(invalidInputStyle);
        PasswordsDoNotMatch = true;
    }
    
    
    
    // Make sure that all the required fields have values.
    if (invalidInput) {
        if(ZEpp_Language=="de") {
            me.$ctnErr.html("<p>Bitte f&uuml;lle alle notwendigen Felder aus.</p>");
        } else {
            me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        }
        me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        return;
    }
    
    if (PasswordsDoNotMatch) {
        if(ZEpp_Language=="de") {
            me.$ctnErr.html("<p>Die beiden Passw&ouml;rter m&uuml;ssen identisch sein.</p>");
        } else {
            me.$ctnErr.html("<p>The passwords do not match.</p>");
        }        
        me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        return;
    }
    
    if (!me.emailAddressIsValid(emailAddress)) {
        if(ZEpp_Language=="de") {
            me.$ctnErr.html("<p>Das ist keine g&uuml;ltige E-Mail Adresse.</p>");
        } else {
            me.$ctnErr.html("<p>Please enter a valid email address.</p>");
        }
        me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        me.$txtEmailAddress.addClass(invalidInputStyle);
        return;
    }
    
    $.mobile.loading("show");   
    
    //alert('start');                
    console.log(ZEpp.Settings.ServerUrl);            
    
    $.ajax({
        type:           'POST',
        dataType:       'json',        
        url:            ZEpp.Settings.ServerUrl + '/_app_api/register_new_user.php',
        crossDomain:    true,   
        data:     ( {

            ZEpp_Form_Register_Language:    ZEpp_Language   ,
            ZEpp_Form_Register_Firstname:   firstName       ,            
            ZEpp_Form_Register_Username:    emailAddress    ,
            ZEpp_Form_Register_Password:    password        ,
            ZEpp_Form_Register_Password_2:  password_2      ,

            ZEpp_Version:                   ZEpp_Version    ,
            Test:                           0
        } ),
      
        success: function (response) {
        
            $.mobile.loading("hide");
            
                console.log('We have received an answer from the server');            
                
                console.log(JSON.stringify(response));                                           
                
                if (response.success === true) {
                
                    console.log('User angelegt');   
                    
                    var Login_Methode = "Durchleiten";
    
                    if(Login_Methode == "Durchleiten") {
                        
                        // Create session. 
                        var today           = new Date();
                        var expirationDate  = new Date();
                        
                        expirationDate.setTime(today.getTime() + ZEpp.Settings.sessionTimeoutInMSec);
                                        
                        //alert(ZEpp.Settings.sessionTimeoutInMSec);
                        //alert(expirationDate);                        
                        //alert(response.New_User_ID);
                        //alert(response.additional_info.User_ID);
                        //alert('ok');
                        //return;
                        //console.log(me.$chkKeepSignedIn.is(":checked"));
                        //return;
                        
                        ZEpp.Session.getInstance().set({
                            User_ID:            response.additional_info.User_ID,
                            User_E_Mail:        response.additional_info.User_E_Mail,
                            User_Rights:        response.additional_info.User_Rights,
                            User_Confirmed:     response.additional_info.User_Confirmed,
                            User_Securekey:     response.additional_info.User_Securekey,
                            User_Assistant_OK:  response.additional_info.User_Assistant_OK,
                            sessionId:          response.additional_info.sessionId,
                            expirationDate:     expirationDate,
                            keepSignedIn:       true    //me.$chkKeepSignedIn.is(":checked")
                        });
                        
                        //alert('passt');
                        
                        window.localStorage.setItem('Home_completed',       0);
                        window.localStorage.setItem('Holiday_completed',    0);
                        window.localStorage.setItem('Profile_completed',    0);
                        window.localStorage.setItem('Assistant_completed',  0);
                                        
                        console.log('Initial value Assistant_completed: ' + response.additional_info.User_Assistant_OK);
                        
                        // Go to main menu.
                        //$.mobile.ajaxEnabled = false;
                        //$.mobile.navigate("application.html");
                        if(response.additional_info.User_Assistant_OK == 1) {
                            document.location.href = "application.html";
                        } else {
                            document.location.href = "assistant.html";
                        }
                        return;
                        
                    } else {
                    
                        $.mobile.navigate(me.PageIDRegisterSuccess);
                    }
                
                
                //$.mobile.navigate('#dlg-sign-up-sent');
                //$.mobile.navigate('#dlg-sign-up-sent', {dataRel:"popup", dataTransition:"pop", dataPositionTo:"window"} );                
                
            
            } else {
                
                console.log('User nicht angelegt');            
                
                if (response.errormessage) {
                    me.$ctnErr.html("<p>" + response.errormessage + "</p>");
                    me.$ctnErr.addClass("zepp-ctn-err").slideDown();
                    return;
                }       
                         
            }
                                    
        },
        
              
        //error: function(e) {
        //   console.log(e.message);
        //}

    
        error: function (xhr, ajaxOptions, thrownError) {
        
            console.log('Sum Ting Wong. We To Low');            
            $.mobile.loading("hide");
            
            var Error_Text = 'Operation failed. ' + thrownError;
            alert(Error_Text);
            //console.log(e.message);
            // TODO: Use a friendlier error message below.
            if(ZEpp_Language=="de") {
                me.$ctnErr.html("<p>Es tut uns leid! ZEpp hat ein Problem und kann Dich gerade nicht registrieren. Bitte versuche es gleich noch einmal.</p>");
            } else {
                me.$ctnErr.html("<p>We're sorry! ZEpp had a problem and could not register you right now. Please try again in one minute.</p>");
            }
            
            me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        }
    }); 
    
    //alert('fertig');
};