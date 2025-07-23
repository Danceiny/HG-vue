export default{
    getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;

    },
    isURL: function (url) {
        // var v = new RegExp();
        // v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
        // if (!v.test(url)) {
        //     return false;
        // }
        // return true;

        //see: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (url.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
}