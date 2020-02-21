//////////////////
// Language functions

function initiate_language(str_Praefix) {

    var Obj_Language = {};

    if(ZEpp_Language == "de") {

        if(document.getElementById('DIV_ID_IMG_Background_Logo')) {
            document.getElementById('DIV_ID_IMG_Background_Logo').className = 'zepp-header-splash-logo-' + ZEpp_Language;
        }

        if(str_Praefix=="Splash") {
            Obj_Language["Language_Splash_Title"]       = "Willkommen bei ZEpp!";
            Obj_Language["Language_Splash_Subtitle"]    = "Wie verbringe ich meine Zeit";
            Obj_Language["Language_Splash_Explanation"] = "Mit ZEpp (Zeit-Erfassungs-App) kannst Du die Zeiten Deiner Aktivit&auml;ten erfassen";
            Obj_Language["Language_Splash_Login"]       = "Einloggen";
            Obj_Language["Language_Splash_Register"]    = "Registrieren";
        }

        if(str_Praefix=="Application") {
            Obj_Language["Language_Home_Title"]        = "ZEpp - Die Zeit-Erfassungs-App";
            Obj_Language["Language_Home_Slogan"]       = "Mit ZEpp beh&auml;ltst Du den &Uuml;berblick, was Du am Tag gemacht hast.";

            Obj_Language["Language_Map_Options"]       = "Suchoptionen";
        }

        if(str_Praefix=="Register") {
            Obj_Language["Language_Register_Title"]         = "F&uuml;r ZEpp registrieren";
            Obj_Language["Language_Register_Hint"]          = "Hinweis: Nur Du kannst Deine Zeiten sehen";
            Obj_Language["Language_Register_Button"]        = "Registrieren";

            document.getElementById('ZEpp_Form_Register_Firstname').placeholder   = "Dein Vorname";
            document.getElementById('ZEpp_Form_Register_Username').placeholder    = "E-Mail Adresse";
            document.getElementById('ZEpp_Form_Register_Password').placeholder    = "Passwort";
            document.getElementById('ZEpp_Form_Register_Password_2').placeholder  = "Passwort bestätigen";
        }

        if(str_Praefix=="Login") {
            Obj_Language["Language_Login_Title"]        = "Login";
            Obj_Language["Language_Login_Button"]       = "Jetzt einloggen";
            Obj_Language["Language_Login_PW_Forgot"]    = "Passwort vergessen?";
            Obj_Language["Language_Login_Register"]     = "Neuen User anlegen";

            document.getElementById('ZEpp_Form_Username').placeholder = "E-Mail Adresse";
            document.getElementById('ZEpp_Form_Password').placeholder = "Passwort";
        }

        if(str_Praefix=="Password_Reset") {
            Obj_Language["Language_Reset_Title"]        = "Passwort zur&uuml;cksetzen";
            Obj_Language["Language_Reset_E_Mail"]       = "Bitte gib hier Deine E-Mail Adresse ein";
            Obj_Language["Language_Reset_Button"]       = "Jetzt zur&uuml;cksetzen";

            document.getElementById('ZEpp_Password_Reset_Username').placeholder = "E-Mail Adresse";
        }

        if(str_Praefix=="Reset_Successful") {
            Obj_Language["Language_Resetted_Title"]   = "Dein Passwort wurde erfolgreich zur&uuml;ckgesetzt";
            Obj_Language["Language_Resetted_Text"]    = "Wir haben Dir eine E-Mail mit dem neuen Passwort gesendet. Schaue in Deinem Posteingang nach der E-Mail und logge Dich mit dem tempor&auml;ren Passwort ein.";
            Obj_Language["Language_Resetted_Button"]  = "OK";
        }

        if(str_Praefix=="My_Locations") {
            Obj_Language["Language_My_Vacations_Title"]             = "Meine Aktivit&auml;ten";
            Obj_Language["Language_My_Vacations_Slogan"]            = "Wenn Du m&ouml;chtest, kannst Du Deine Aktivit&auml;ten auch &auml;ndern oder l&ouml;schen.";
            Obj_Language["Language_My_Vacations_Button_Manual"]     = "Neuen Urlaubsort hinzuf&uuml;gen";
            Obj_Language["Language_My_Vacations_Button_Scan"]       = "Urlaubs-QRCode scannen";
            Obj_Language["Language_My_Vacations_Subtitle"]          = "Meine Urlaubsorte";
            Obj_Language["Language_My_Vacations_Home_Title"]        = "Mein Heimatort";
            Obj_Language["Language_My_Vacations_Home_Explanation"]  = "Deinen aktuellen Heimatort nehmen wir immer als Deinen Aufenthaltsort an, wenn Du nicht im Urlaub bist. Du kannst Deinen aktuellen Heimatort hier nicht &auml;ndern. Konfiguriere Deinen Heimatort im Men&uuml;punkt Herkunft";
            Obj_Language["Language_My_Vacations_Home_OK"]           = "OK";
        }

        if(str_Praefix=="Add_Location") {
            Obj_Language["Language_Add_Location_Title"]             = "Urlaub hinzuf&uuml;gen";
            Obj_Language["Language_Add_Location_Slogan"]            = "Klasse! Wir finden es toll, dass Du einen Urlaub zu Deinem Profil hinzuf&uuml;gen m&ouml;chtest.";
        }

        if(str_Praefix=="Add_Location_Barcode") {
            Obj_Language["Language_Location_Barcode_Title"]         = "Urlaub-Scan erfolgreich.";
            Obj_Language["Language_Location_Barcode_Explanation"]   = "Bitte gib nun Start- und Enddatum f&uuml;r diesen Urlaub ein.";
        }
        
        if(str_Praefix=="Location_Details") {
            Obj_Language["Language_Location_Details_Title"]         = "Urlaubs-Details";
            Obj_Language["Language_Location_Details_Subtitle"]      = "Beschreibung";
            Obj_Language["Language_Location_Details_Explanation"]   = "Details Deines Urlaubs";
            
            Obj_Language["Language_Location_Details_Options"]       = "Suchoptionen";
        }

        if(str_Praefix=="Edit_Location") {
            Obj_Language["Language_Edit_Location_Title"]             = "Daten Deiner Aktivit&auml;t &auml;ndern";
            Obj_Language["Language_Edit_Location_Explanation"]       = "&Auml;ndere hier die Daten dieser Aktivit&auml;t.";
        }

        if(str_Praefix=="Add_Origin") {
            Obj_Language["Language_Add_Origin_Title"]             = "Herkunft hinzuf&uuml;gen";
            Obj_Language["Language_Add_Origin_Slogan"]            = "Klasse! Wir finden es toll, dass Du Deinen Wohnort, Deine Arbeitsst&auml;tte oder ein Interessanten Ort zu Deinem Profil hinzuf&uuml;gen m&ouml;chtest.";
        }

        if(str_Praefix=="Add_Origin_Barcode") {
            Obj_Language["Language_Origin_Barcode_Title"]         = "Herkunft-Scan erfolgreich.";
            //Obj_Language["Language_Origin_Barcode_Explanation"]   = "Bitte gib nun Start- und ggf. Enddatum Deiner Herkunft ein.";
        }

        if(str_Praefix=="Edit_Origin") {
            Obj_Language["Language_Edit_Origin_Title"]              = "Herkunftsdaten &auml;ndern";
            Obj_Language["Language_Edit_Origin_Explanation"]        = "Hier kannst Du die Daten Deiner Herkunft &auml;ndern";
            Obj_Language["Language_Edit_Origin_Explanation_Delete"] = "Wenn Du diese Herkunft komplett l&ouml;schen m&ouml;chtest, scrolle bitte nach ganz unten.";
        }

        if(str_Praefix=="Change_Password") {
            Obj_Language["Language_Change_Password_Title"]          = "Passwort &auml;ndern";
            Obj_Language["Language_Change_Password_Slogan"]         = "Hier kannst Du das Passwort f&uuml;r Deinen Account &auml;ndern";
        }

        if(str_Praefix=="Confirm_E_Mail") {
            Obj_Language["Language_Confirm_Title"]          = "Best&auml;tigung Deiner E-Mail Adresse";
            Obj_Language["Language_Confirm_Slogan"]          = "Um Deinen Account vor Missbrauch zu sch&uuml;tzen, kannst Du Deine E-Mail Adresse best&auml;tigen.";
        }

        if(str_Praefix=="Profile") {
            Obj_Language["Language_Profile_Title"]              = "Mein Profil";
            Obj_Language["Language_Profile_Explanation"]        = "F&uuml;ge ein paar Informationen zu Deinem Profil dazu.";
        }

        if(str_Praefix=="Assistant_1") {
            Obj_Language["Language_Assistant_1_Header"]             = "Setup Assistent 1/3";
            Obj_Language["Language_Assistant_1_Title"]              = "Konfiguriere Deinen aktuellen Heimatort";
            Obj_Language["Language_Assistant_1_Explanation"]        = "Um diese App benutzen zu k&ouml;nnen, brauchst Du einen aktuellen Wohnort. Das kann eine Stadt, ein Stadtteil oder ein Ort sein. Wir werden Dich niemals nach Deiner genauen Adresse fragen.";
        }

        if(str_Praefix=="Assistant_2") {
            Obj_Language["Language_Assistant_2_Header"]             = "Setup Assistent 2/3";
            Obj_Language["Language_Assistant_2_Title"]              = "Konfiguriere Deinen Urlaubsort";
            Obj_Language["Language_Assistant_2_Explanation"]        = "Wenn Du gerade Urlaub machst, trage hier das Hotel, den Campingplatz oder einfach die Stadt ein, wo Du gerade bist. Falls Du gerade nicht im Urlaub bist, kannst Du den Schritt &uuml;berspringen.";
        }

        if(str_Praefix=="Assistant_3") {
            Obj_Language["Language_Assistant_3_Header"]             = "Setup Assistent 3/3";
            Obj_Language["Language_Assistant_3_Title"]              = "Vervollst&auml;ndige Dein Profil";
            Obj_Language["Language_Assistant_3_Explanation"]        = "Um nach anderen Personen in Deinem Alter und Familienstand suchen zu k&ouml;nnen, w&uuml;rden wir uns freuen, wenn Du Dein Profil vervollst&auml;ndigen w&uuml;rdest.";
        }



        if(str_Praefix=="My_Origins") {
            Obj_Language["Language_My_Origins_Title"]                     = "Meine Herkunft";
            Obj_Language["Language_My_Origins_Slogan"]                    = "Deine Herkunft definiert, wer Du bist. Es gibt drei verschiedene Herkunftsarten: Wohnort, Arbeit, Interessen";
            Obj_Language["Language_My_Origins_Button_Manual"]             = "Neue Herkunft (Wohnort / Arbeitsplatz / Ort von Interesse) hinzuf&uuml;gen";
            Obj_Language["Language_My_Origins_Button_Scan"]               = "Herkunfts-QRCode scannen";
            Obj_Language["Language_My_Origins_Tab_Home"]                  = "Wohnort";
            Obj_Language["Language_My_Origins_Tab_Work"]                  = "Arbeit";
            Obj_Language["Language_My_Origins_Tab_Interest"]              = "Interessen";
            Obj_Language["Language_My_Origins_Tab_Home_Title"]            = "Mein Wohnort";
            Obj_Language["Language_My_Origins_Tab_Home_Explanation"]      = "Der Ort, Stadt oder Stadtteil, in dem Du wohnst oder einmal gewohnt hast.";
            Obj_Language["Language_My_Origins_Tab_Work_Title"]            = "Mein Arbeitsplatz";
            Obj_Language["Language_My_Origins_Tab_Work_Explanation"]      = "Die Firma oder Arbeitsplatz, an dem Du arbeitest oder einmal gearbeitet hast.";
            Obj_Language["Language_My_Origins_Tab_Interest_Title"]        = "Meine Interessen";
            Obj_Language["Language_My_Origins_Tab_Interest_Explanation"]  = "Deine Vereine, Orte und Dinge, an denen Du interessiert bist. Das kann Dein Tennisclub, dein Lieblingsrestaurant oder ein See sein, in dem Du gerne schwimmen gehst.";
        }


        Obj_Language["Language_Menu_Home"]      = "Aktivit&auml;ten";
        Obj_Language["Language_Menu_Vacations"] = "Historie";
        Obj_Language["Language_Menu_Roots"]     = "Analyse";
        Obj_Language["Language_Menu_Contacts"]  = "Kategorien";

        Obj_Language["Language_Footer_Title"]       = "ZEpp - Die Zeit-Erfassungs-App";
        Obj_Language["Language_Footer_Text1"]       = "Copyright &copy; 2020 ZEpp&trade;<br>Alle Rechte vorbehalten.";
        Obj_Language["Language_Footer_Text2"]       = "";
        Obj_Language["Language_Footer_Terms"]       = "Impressum";
        Obj_Language["Language_Footer_Protection"]  = "Datenschutzerkl&auml;rung";
        Obj_Language["Language_Social_Media"]       = "Folge uns in den sozialen Netzwerken";
        Obj_Language["Language_Contact_Title"]      = "Nimm Kontakt mit uns auf";
        Obj_Language["Language_Contact_Form"]       = "Kontaktformular";


        Obj_Language["Language_Options_Title"]            = "Optionen";
        Obj_Language["Language_Options_Edit_Profile"]     = "Profil bearbeiten";
        Obj_Language["Language_Options_Change_Password"]  = "Passwort &auml;ndern";
        Obj_Language["Language_Options_Logout"]           = "Ausloggen";
        Obj_Language["Language_Options_Logged_In_As"]     = "Eingeloggt als";
        Obj_Language["Language_Options_Signed_In_Until"]  = "Angemeldet bis";

        Obj_Language["Language_Logout_Title"]     = "Ausloggen";
        Obj_Language["Language_Logout_Question"]  = "M&ouml;chtest Du Dich wirklich aus ZEpp ausloggen?";
        Obj_Language["Language_Logout_Yes"]       = "Ja, bitte!";
        Obj_Language["Language_Logout_No"]        = "Nein, ich m&ouml;chte noch bleiben";



    } else if(ZEpp_Language == "en") { // fallback language

        if(document.getElementById('DIV_ID_IMG_Background_Logo')) {
            document.getElementById('DIV_ID_IMG_Background_Logo').className = 'zepp-header-splash-logo-' + ZEpp_Language;
        }

        if(str_Praefix=="Splash") {
            Obj_Language["Language_Splash_Title"]       = "Welcome to ZEpp!";
            Obj_Language["Language_Splash_Subtitle"]    = "It's a small world. Find out!";
            Obj_Language["Language_Splash_Explanation"] = "ZEpp (Next to me) finds people from your home town, working place or sports club that are next to your holiday location.";
            Obj_Language["Language_Splash_Login"]       = "Log In";
            Obj_Language["Language_Splash_Register"]    = "Register";
        }

        if(str_Praefix=="Application") {
            Obj_Language["Language_Home_Title"]        = "ZEpp - The Holiday App";
            Obj_Language["Language_Home_Slogan"]       = "With ZEpp you see people from your home town, work or sports club that are located right next to you - wherever you are.";            
        }

        if(str_Praefix=="Register") {
            Obj_Language["Language_Register_Title"]         = "Register for ZEpp";
            Obj_Language["Language_Register_Hint"]          = "Hint: You stay anonymous. Everybody is just represented by a First Name and a marker on a map.";
            Obj_Language["Language_Register_Button"]        = "Register";

            document.getElementById('ZEpp_Form_Register_Firstname').placeholder   = "Your first name";
            document.getElementById('ZEpp_Form_Register_Username').placeholder    = "E-mail address";
            document.getElementById('ZEpp_Form_Register_Password').placeholder    = "Password";
            document.getElementById('ZEpp_Form_Register_Password_2').placeholder  = "Confirm Password";
        }

        if(str_Praefix=="Login") {
            Obj_Language["Language_Login_Title"]        = "Login";
            Obj_Language["Language_Login_Button"]       = "Login now";
            Obj_Language["Language_Login_PW_Forgot"]    = "Forgot your password";
            Obj_Language["Language_Login_Register"]     = "Register new user";

            document.getElementById('ZEpp_Form_Username').placeholder = "E-mail address";
            document.getElementById('ZEpp_Form_Password').placeholder = "Password";
        }

        if(str_Praefix=="Password_Reset") {
            Obj_Language["Language_Reset_Title"]        = "Reset your password";
            Obj_Language["Language_Reset_E_Mail"]       = "Please enter your email address here";
            Obj_Language["Language_Reset_Button"]       = "Reset password now";

            document.getElementById('ZEpp_Password_Reset_Username').placeholder = "E-mail address";
        }

        if(str_Praefix=="Reset_Successful") {
            Obj_Language["Language_Resetted_Title"]   = "Your Password has been resetted successfully";
            Obj_Language["Language_Resetted_Text"]    = "We sent you an email with a new password to your email address. Please check your inbox and use the temporary password for the login.";
            Obj_Language["Language_Resetted_Button"]  = "OK";
        }

        if(str_Praefix=="My_Locations") {
            Obj_Language["Language_My_Vacations_Title"]             = "My Vacations";
            Obj_Language["Language_My_Vacations_Slogan"]            = "If you are on vacation, you can add a this place right here to your profile. If there is no vacation active, we assume, you're at home.";
            Obj_Language["Language_My_Vacations_Button_Manual"]     = "Add a new Vacation";
            Obj_Language["Language_My_Vacations_Button_Scan"]       = "Scan a Vacation QRCode";
            Obj_Language["Language_My_Vacations_Subtitle"]          = "My Vacations";
            Obj_Language["Language_My_Vacations_Home_Title"]        = "Home, sweet Home";
            Obj_Language["Language_My_Vacations_Home_Explanation"]  = "Your current Home Origin is your default location, if you're not on vacation. It can not be removed from here. You can configure your Home Origin in the Origins-Tab.";
            Obj_Language["Language_My_Vacations_Home_OK"]           = "OK";
        }

        if(str_Praefix=="Add_Location") {
            Obj_Language["Language_Add_Location_Title"]             = "Add Vacation";
            Obj_Language["Language_Add_Location_Slogan"]            = "You're going on vacation or planning to do so? Then enter your destination here.";
        }

        if(str_Praefix=="Add_Location_Barcode") {
            Obj_Language["Language_Location_Barcode_Title"]         = "Vacation-Scan successful.";
            Obj_Language["Language_Location_Barcode_Explanation"]   = "Now please enter additional data for this specific vacation.";
        }

        if(str_Praefix=="Location_Details") {
            Obj_Language["Language_Location_Details_Title"]         = "Vacation Details";
            Obj_Language["Language_Location_Details_Subtitle"]      = "Description";
            Obj_Language["Language_Location_Details_Explanation"]   = "See here the details of your vacation";
            
            Obj_Language["Language_Location_Details_Options"]       = "Search options";
        }
        
        if(str_Praefix=="Edit_Location") {
            Obj_Language["Language_Edit_Location_Title"]             = "Edit Vacation";
            Obj_Language["Language_Edit_Location_Explanation"]       = "Change the dates of this vacation.";
        }

        if(str_Praefix=="Add_Origin") {
            Obj_Language["Language_Add_Origin_Title"]             = "Add Origin";
            Obj_Language["Language_Add_Origin_Slogan"]            = "We like that you want to add a new origin to your profile.";
        }

        if(str_Praefix=="Add_Origin_Barcode") {
            Obj_Language["Language_Origin_Barcode_Title"]         = "Origin Scan successful.";
            //Obj_Language["Language_Origin_Barcode_Explanation"]   = "Now please enter additional data for this specific origin.";
        }

        if(str_Praefix=="Edit_Location") {
            Obj_Language["Language_Edit_Origin_Title"]              = "Edit Origin";
            Obj_Language["Language_Edit_Origin_Explanation"]        = "Here you can change the settings of this origin.";
            Obj_Language["Language_Edit_Origin_Explanation_Delete"] = "If you want to remove it completely, scroll down to the bottom of the page.";
        }

        if(str_Praefix=="Profile") {
            Obj_Language["Language_Profile_Title"]              = "My Profile";
            Obj_Language["Language_Profile_Explanation"]        = "Add some information to your profile.";
        }

        if(str_Praefix=="Assistant_1") {
            Obj_Language["Language_Assistant_1_Header"]             = "Setup Assistant 1/3";
            Obj_Language["Language_Assistant_1_Title"]              = "Configure your actual Home Town";
            Obj_Language["Language_Assistant_1_Explanation"]        = "To use this app you need to configure your home town or district. You will never be asked to enter your address completely.";
        }

        if(str_Praefix=="Assistant_2") {
            Obj_Language["Language_Assistant_2_Header"]             = "Setup Assistant 2/3";
            Obj_Language["Language_Assistant_2_Title"]              = "Configure your Holiday Location";
            Obj_Language["Language_Assistant_2_Explanation"]        = "If you're on holiday, enter the place where you stay. If you're at home right now, skip this step.";
        }

        if(str_Praefix=="Assistant_3") {
            Obj_Language["Language_Assistant_3_Header"]             = "Setup Assistant 3/3";
            Obj_Language["Language_Assistant_3_Title"]              = "Configure your Personnel Settings";
            Obj_Language["Language_Assistant_3_Explanation"]        = "To locate people in your age and family situation, you can now add additional information to your profile.";
        }

        if(str_Praefix=="My_Origins") {
            Obj_Language["Language_My_Origins_Title"]                     = "My Origins";
            Obj_Language["Language_My_Origins_Slogan"]                    = "Your origins define who you are. There are three different origin types. Home, Work and Interest.";
            Obj_Language["Language_My_Origins_Button_Manual"]             = "Add new Origin (Home / Work / Place of Interest)";
            Obj_Language["Language_My_Origins_Button_Scan"]               = "Scan a Origin-QRCode";
            Obj_Language["Language_My_Origins_Tab_Home"]                  = "Home";
            Obj_Language["Language_My_Origins_Tab_Work"]                  = "Work";
            Obj_Language["Language_My_Origins_Tab_Interest"]              = "Interest";
            Obj_Language["Language_My_Origins_Tab_Home_Title"]            = "My Home";
            Obj_Language["Language_My_Origins_Tab_Home_Explanation"]      = "The city, town or district where you live or have lived before.";
            Obj_Language["Language_My_Origins_Tab_Work_Title"]            = "My Work";
            Obj_Language["Language_My_Origins_Tab_Work_Explanation"]      = "The company or place you work or have worked before.";
            Obj_Language["Language_My_Origins_Tab_Interest_Title"]        = "My Interest";
            Obj_Language["Language_My_Origins_Tab_Interest_Explanation"]  = "The hobbies you have or things you're interested in. This can be your tennis club, favorite pizzeria or a lake where you like to swim.";
        }

        Obj_Language["Language_Menu_Home"]      = "Home";
        Obj_Language["Language_Menu_Vacations"] = "Vacations";
        Obj_Language["Language_Menu_Roots"]     = "Origins";
        Obj_Language["Language_Menu_Contacts"]  = "Chats";

        Obj_Language["Language_Footer_Title"]       = "ZEpp - The Holiday App";
        Obj_Language["Language_Footer_Text1"]       = "Copyright &copy; 2020 by ZEpp&trade;<br>All rights reserved.";
        Obj_Language["Language_Footer_Text2"]       = "";
        Obj_Language["Language_Footer_Terms"]       = "Legal notice";
        Obj_Language["Language_Footer_Protection"]  = "Data protection";
        Obj_Language["Language_Social_Media"]       = "Follow us on social media";
        Obj_Language["Language_Contact_Title"]      = "Get in contact with us";
        Obj_Language["Language_Contact_Form"]       = "Contact Form";

    }

    $.each( Obj_Language, function( Language_Key, Language_Value ) {

        if(document.getElementById(Language_Key)) {
            $("zepp[id='" + Language_Key + "']").html(Language_Value); //Supports multiple ID-Elements
            //$('#' + Language_Key).html(Language_Value);
        }

    });

    //alert("Language is set!");

}

// Language functions
//////////////////