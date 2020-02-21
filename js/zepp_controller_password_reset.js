
var ZEpp = ZEpp || {};

ZEpp.PasswordResetController = function () {

    this.$PasswordResetPage   = null;
    this.$btnSubmit           = null;
    this.$txtEmailAddress     = null;
    this.$ctnErr              = null;
    this.LoginPage            = null;
    
};



ZEpp.PasswordResetController.prototype.init = function () {

    console.log('PasswordResetController init');
    
    this.$PasswordResetPage = $("#PAGE_ID_Password_Reset");
    this.$btnSubmit         = $("#BTN_ID_Reset"                   , this.$PasswordResetPage);
    this.$txtEmailAddress   = $("#ZEpp_Password_Reset_Username" , this.$PasswordResetPage);
    this.$ctnErr            = $("#DIV_ID_Reset_Error"             , this.$PasswordResetPage);
    this.LoginPage          = "#PAGE_ID_Reset_Successful";
    
};


ZEpp.PasswordResetController.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


ZEpp.PasswordResetController.prototype.resetPasswordResetForm = function () {

    var invisibleStyle    = "zepp-invisible",
        invalidInputStyle = "zepp-invalid-input";
    
    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    this.$txtEmailAddress.removeClass(invalidInputStyle);
    this.$txtEmailAddress.val("");
    
};


ZEpp.PasswordResetController.prototype.onPasswordResetCommand = function () {

    var me                = this,
        emailAddress      = me.$txtEmailAddress.val().trim(),
        invalidInput      = false,
        invisibleStyle    = "zepp-invisible",
        invalidInputStyle = "zepp-invalid-input";
    
    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$ctnErr.html("");
    
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    
    // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
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
        type:           'POST',
        dataType:       'json',        
        url:            ZEpp.Settings.ServerUrl + '/_app_api/reset_password.php',
        crossDomain:    true,   
        data:     ( {
            ZEpp_Password_Reset_Username:   emailAddress    ,

            ZEpp_Version:                   ZEpp_Version  ,
            Test:                             0
        } ),
      
        success: function (response) {
        
            $.mobile.loading("hide");
            
            console.log('We have received an answer from the server');            
            
            //alert(JSON.stringify(response));                                           
            
            if (response.success === true) {
            
                console.log('Password reset completed');            
                $.mobile.navigate(me.LoginPage);
                //$.mobile.navigate('#dlg-sign-up-sent');
                //$.mobile.navigate('#dlg-sign-up-sent', {dataRel:"popup", dataTransition:"pop", dataPositionTo:"window"} );                
                
            
            } else {
                
                console.log('Password reset failed');            
                
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
            if(ZEpp_Language=="de") {
                me.$ctnErr.html("<p>Es tut uns leid! ZEpp hat ein Problem und konnte Dein Passwort nicht zur&uuml;cksetzen. Bitte versuche es gleich noch einmal.</p>");
            } else {
                me.$ctnErr.html("<p>We're sorry! ZEpp had a problem and could not reset your password. Please try again.</p>");
            }
            me.$ctnErr.addClass("zepp-ctn-err").slideDown();
        }
    }); 
    
};