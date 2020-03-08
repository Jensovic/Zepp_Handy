
var ZEpp = ZEpp || {};

ZEpp.SignInController = function () {

    this.$signInPage      = null;
    this.$btnSubmit       = null;
    this.$txtEmailAddress = null;
    this.$txtPassword     = null;
    this.$chkKeepSignedIn = null;
    this.$ctnErr          = null;
    this.mainMenuPageId   = null;
    
};



ZEpp.SignInController.prototype.init = function () {

    console.log('SignInController init');
    
    this.$signInPage      = $("#PAGE_ID_Login");
    this.$btnSubmit       = $("#BTN_ID_Login"               , this.$signInPage);
    this.$txtEmailAddress = $("#ZEpp_Form_Username"       , this.$signInPage);
    this.$txtPassword     = $("#ZEpp_Form_Password"       , this.$signInPage);
    this.$chkKeepSignedIn = $("#ZEpp_Form_Keep_Signed_In" , this.$signInPage);
    this.$ctnErr          = $("#DIV_ID_Login_Error"         , this.$signInPage);
    this.mainMenuPageId   = "#PAGE_ID_ZEpp";
    
};


ZEpp.SignInController.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


ZEpp.SignInController.prototype.resetSignInForm = function () {

    var invisibleStyle    = "zepp-invisible",
        invalidInputStyle = "zepp-invalid-input";
    
    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    this.$txtEmailAddress.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
    this.$txtEmailAddress.val("");
    this.$txtPassword.val("");
    this.$chkKeepSignedIn.prop("checked", false);
    //document.getElementById('ZEpp_Form_Username').focus();
    //alert('yupp');
    
};


ZEpp.SignInController.prototype.onSignInCommand = function () {

    var me                = this,
        emailAddress      = me.$txtEmailAddress.val().trim(),
        password          = me.$txtPassword.val().trim(),
        invalidInput      = false,
        invisibleStyle    = "zepp-invisible",
        invalidInputStyle = "zepp-invalid-input";
    
    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$ctnErr.html("");
    
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
    
    // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
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
    
    var RandomNumber = Math.floor((Math.random() * 10000000) + 1);
    
    $.ajax({
        type:           'GET',
        dataType:       'jsonp',        
        url:            ZEpp.Settings.ServerUrl + '/_app_api/get_login_jsonp.php',
        //async:        false,
        jsonpCallback:  'ZEpp_Login_Callback_' + RandomNumber,
        contentType:    'application/json',
        data:     ( {
            ZEpp_Form_Username:       emailAddress        ,
            ZEpp_Form_Password:       password            ,
            //ZEpp_Security_Code:       ZEpp_Security_Code        ,
            //ZEpp_Form_Keep_Signed_In: ZEpp_Form_Keep_Signed_In  ,
            ZEpp_Version:             ZEpp_Version      ,
            Test:                       0
        } ),
      
        success: function (resp) {
        
            $.mobile.loading("hide");
            
            console.log('We have received the data from a jsonp object');            
            
            if (resp.success === true) {
                
                console.log('Credentials are correct');            
                
                // Create session. 
                var today           = new Date();
                var expirationDate  = new Date();
                
                expirationDate.setTime(today.getTime() + ZEpp.Settings.sessionTimeoutInMSec);
                                
                //alert(ZEpp.Settings.sessionTimeoutInMSec);
                //alert(expirationDate);
                //return;
                //console.log(me.$chkKeepSignedIn.is(":checked"));
                //return;
                
                ZEpp.Session.getInstance().set({
                    User_ID:            resp.UserInfo.User_ID,
                    User_E_Mail:        resp.UserInfo.User_E_Mail,
                    User_Rights:        resp.UserInfo.User_Rights,
                    User_Confirmed:     resp.UserInfo.User_Confirmed,
                    User_Securekey:     resp.UserInfo.User_Securekey,
                    User_Assistant_OK:  resp.UserInfo.User_Assistant_OK,
                    sessionId:          resp.UserInfo.sessionId,
                    expirationDate:     expirationDate,
                    keepSignedIn:       true    //me.$chkKeepSignedIn.is(":checked")
                });
                
                window.localStorage.setItem('Assistant_completed',  resp.UserInfo.User_Assistant_OK);
                window.localStorage.setItem('Temporary_Password',   resp.UserInfo.User_Temporary_Password);
                window.localStorage.setItem('Application_Language', resp.UserInfo.User_Language);
                
                console.log('Initial value Assistant_completed: ' + resp.UserInfo.User_Assistant_OK);
                
                // Go to main menu.
                //$.mobile.ajaxEnabled = false;
                //$.mobile.navigate("application.html");
                //if(resp.UserInfo.User_Assistant_OK == 1) {
                    document.location.href = "application.html";
                //} else {
                //    document.location.href = "assistant.html";
                //}
                return;
                
            } else {
                
                console.log('Credentials are wrong');            
                                         
                if (resp.explanation.Error_Id) {
                
                    switch (resp.explanation.Error_Id) {
                        case 'Username':   
                            if(ZEpp_Language=="de") {
                                me.$ctnErr.html("<p>Diese E-Mail Adresse ist bei ZEpp noch unbekannt.</p>");
                            } else {
                                me.$ctnErr.html("<p>ZEpp does not know this E-Mail Address.</p>");
                            }
                            me.$ctnErr.addClass("zepp-ctn-err").slideDown();
                            me.$txtEmailAddress.addClass(invalidInputStyle);
                            break;
                        case 'Password':
                            if(ZEpp_Language=="de") {
                                me.$ctnErr.html("<p>Du hast ein falsches Passwort eingegeben. Bitte versuche es noch einmal.</p>");
                            } else {
                                me.$ctnErr.html("<p>You entered a wrong password. Please try again.</p>");
                            }
                            me.$ctnErr.addClass("zepp-ctn-err").slideDown();
                            me.$txtPassword.addClass(invalidInputStyle);
                            break;
                    }
                    
                }
                
            }
        },                      
    
        error: function (xhr, ajaxOptions, thrownError) {
            $.mobile.loading("hide");
            console.log('Sum Ting Wong');
            var Error_Text = 'Operation failed. ' + thrownError;
            alert(Error_Text);
            //console.log(e.message);
            // TODO: Use a friendlier error message below.
            if(ZEpp_Language=="de") {
                me.$ctnErr.html("<p>Es tut uns leid! ZEpp hat ein Problem und kann Dich gerade nicht einloggen. Bitte versuche es gleich noch einmal.</p>");
            } else {
                me.$ctnErr.html("<p>We're sorry! ZEpp had a problem and could not log you on. Please try again.</p>");
            }
            me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        }
    });
};