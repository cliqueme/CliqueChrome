$(function() {
    console.log('hello from content script!');

    // init textarea with stored value
    chrome.storage.local.get('appendHtml', function (data) {
        if (data){
            $('#html-to-append').val(data.appendHtml);
        }
    });

    // handle submit click
    $('#btn-go').click(function(){
        set_and_go($('#html-to-append').val());

        return false;
    });

    // clear button click
    $('#btn-clear').click(function(){
        // clear textarea
        $('#html-to-append').val('');
        // reload the page
        set_and_go("");
    });

});

function set_and_go(html){
    chrome.tabs.getSelected(null, function(tab) {
        // put html into the storage
        chrome.storage.local.set({
            appendHtml: html
        });

        // reload the tab
        chrome.tabs.reload(tab.id);
    });
}