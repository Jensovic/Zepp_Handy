
var ZEpp = ZEpp || {};

ZEpp.Session = (function () {

    var instance;
    
    function init() {
    
        var sessionIdKey = 'zepp-session';
        
        return {
        
            // Public methods and variables.
            set: function (sessionData) {
                //alert(JSON.stringify(sessionData));
                window.localStorage.setItem(sessionIdKey, JSON.stringify(sessionData));
                //NativeStorage.setItem(sessionIdKey, JSON.stringify(sessionData), fct_nativestorage_store_success, fct_nativestorage_store_fail);
            },
            
            get: function () {
                var result = null;
                try {
                    result = JSON.parse(window.localStorage.getItem(sessionIdKey));
                    //result = JSON.parse(NativeStorage.getItem(sessionIdKey, fct_nativestorage_get_success, fct_nativestorage_get_fail));                    
                    //alert(JSON.stringify(result));
                } catch(e){}
                //alert(result);
                return result;
            }
            
        };
        
    };
    
    return {
    
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
        
    };
    
}());
