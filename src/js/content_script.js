var url_regex = /:\/\/(.[^/]+)/;
var platform_url = "http://static.cliqueme.com/cliqueme-latest.js";

/*
 * extracts domain name from given url string
 */
function get_domain(url) {
    return url_regex.exec(url)[1].toLowerCase();
}

/*
 * checks given page if it enabled for the platform
 */
function check_platform_on_page(url, callback) {
    var domain = get_domain(url);

    chrome.storage.local.get(null, function (config) {

        console.log('config', config);

        if (config.sites && config.sites.indexOf(domain) > -1) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}

function attach_script(src){

    var script = document.createElement('script')
    script.setAttribute("type","text/javascript")
    script.setAttribute("src", src)

    if (typeof script!="undefined"){
        document.getElementsByTagName("body")[0].appendChild(script);
    }
}

check_platform_on_page(window.location.href, function(result){
    console.log('cliqueme: is platform enabled on this site? ', result);
    if (result){
        // attach platform script to page
        attach_script(platform_url);
    }
});
