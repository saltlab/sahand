// random xhr id generator

function generateRandomUniqueId() {
    return PseudoGuid.GetNew();
}

var PseudoGuid = new (function() {
//    this.empty = "00000000-0000-0000-0000-000000000000";
    this.empty = "000000000000";
    this.GetNew = function() {
        var fourChars = function() {
            return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase();
        }
        return (fourChars() + fourChars() + fourChars());
//    	return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };
})();


/**********************/
/*** XMLHTTPREQUEST ***/
/**********************/

var __XMLHttpRequest = XMLHttpRequest;

XMLHttpRequest = function() {

    var xhr = new __XMLHttpRequest();

    // TODO UNIQUE RANDOM ID?
    var id = generateRandomUniqueId();
    xhr.id = id;

    var __open = xhr.open;
    xhr.open = function(method, url, async) {
        logger.logXHROpen(xhr, method, url, async);
        return __open.apply(this, [ method, url, async ]);

    }

    var __send = xhr.send;
    xhr.send = function(str) {
        logger.logXHRSend(xhr, str);
        return __send.apply(this, [ str ]);
    }

    var onreadystatechange = function() {
        if (this.readyState == 4) {
            logger.logXHRResponse(this);
        }
    }

    var onload = function() {
        logger.logXHRResponse(this);
    }

    xhr.addEventListener("readystatechange", onreadystatechange, false);

    return xhr;
}



/**********************/
/****** TIMEOUT *******/
/**********************/

// Keep the current setTimeout function
window.__setTimeout = window.setTimeout;

// Redefine setTimeout
window.setTimeout = function(func, delay, params) {
    var wrapperFunc = new Object();


    //var timeoutArgs = Array.prototype.slice.call(arguments, 2);
    var timeoutArgs = null;

    if (Object.prototype.toString.apply(func) === '[object String]') {
        wrapperFunc._original = func;
        wrapperFunc.name = func;
        func = wrapperFunc;
    }

    // Log the creation of the timeout
    logger.logSetTimeout(func, delay, timeoutArgs);

    // Call the original timeout after logging
    window.__SetTimeout(function(/* params */) {
        try {
            logger.logTimeoutCallback(func);

            if (Object.prototype.toString.apply(func) === '[object Function]') {
                func.apply(null);
            } else if (Object.prototype.toString.apply(func) === '[object String]') {
                // eval(func);
            } else if (Object.prototype.toString.apply(func) === '[object Object]' && func._original) {
                eval(func._original);
            } else {
                window.console.log('Invalid timeout callback, must be Function or String.');
            }
        } catch (exception) {
            // alert("Timeout exception");
        }
    }, delay);
};
