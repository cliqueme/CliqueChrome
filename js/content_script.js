chrome.storage.local.get('appendHtml', function (data) {
    if (data) {
        $('body').append(data.appendHtml);
    }
});
