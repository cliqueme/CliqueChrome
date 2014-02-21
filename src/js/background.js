var cliqueme_off_icon = "/img/icons/logo-off.png";
var cliqueme_on_icon = "/img/icons/logo-on.png";
var url_regex = /:\/\/(.[^/]+)/;

chrome.storage.local.clear();

/*
 * Action click handler. enables or disables the platform
 */
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('action clicked', tab);

    check_platform_on_page(tab.url, function (result) {
        if (result) {
            // remove from page
            remove_page_from_platform(tab.url, function(){
                update_browser_action(tab.url);
                chrome.tabs.reload(tab.tabId);
            });
        }
        else {
            // add to page
            add_page_to_platform(tab.url, function(){
                update_browser_action(tab.url);
                chrome.tabs.reload(tab.tabId);
            });
        }
    });
});

/*
 * Handle new tab activation
 */
chrome.tabs.onActivated.addListener(function (info) {

    chrome.tabs.get(info.tabId, function(tab) {
        console.log('new tab active', tab.url);

        update_browser_action(tab.url);
    });
});

/*
* listen for tab changes and update icon status
*/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        console.log('tab changed to url', get_domain(changeInfo.url));

        update_browser_action(changeInfo.url);
    }
});

/*
* updates browser action icon recording to platform status
*/
function update_browser_action(url){
    check_platform_on_page(url, function (result) {
        if (result) {
            chrome.browserAction.setIcon({path: cliqueme_on_icon});
        } else {
            chrome.browserAction.setIcon({path: cliqueme_off_icon});
        }
    });
}

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

/*
* add given page to internal storage of enabled websites
*/
function add_page_to_platform(url, callback) {
    var domain = get_domain(url);

    chrome.storage.local.get(null, function (config) {

        if (!config.sites) {
            config.sites = [];
        }

        config.sites.push(domain);
        chrome.storage.local.set(config, function(){
            callback();
        });

        console.log('site added to storage', config);
    });
}

/*
* remove given url from sites, enabled for the platform
*/
function remove_page_from_platform(url, callback) {
    var domain = get_domain(url);

    chrome.storage.local.get(null, function (config) {

        if (config && config.sites && config.sites.length && config.sites.indexOf(domain) > -1) {

            console.log('looking for domain', config.sites.indexOf(domain));

            config.sites.splice(config.sites.indexOf(domain), 1);
            chrome.storage.local.set(config, function(){
                callback();
            });

            console.log('site removed from storage', config);
        }
    });
}