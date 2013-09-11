$(function() {
    console.log('hello from content script!');

    // init textarea with stored value
    chrome.storage.local.get(null, function (data) {
        console.log('storage', data);
        $('#txt-html').val(data.html);
        $('#txt-siteid').val(data.site_id);
        $('#txt-selector').val(data.selector);
        $('#txt-url').val(data.url);
    });

    // handle submit click
    $('#btn-go').click(function(){

        set_and_go($('#txt-html').val(),
            $('#txt-siteid').val(),
            $('#txt-selector').val(),
            $('#txt-url').val());

        return false;
    });

    // clear button click
    $('#btn-clear').click(function(){
        // clear textarea
        $('#txt-html').val('');
		$('#txt-javascript').val('');
		$('#txt-url').val('');
		
        // reload the page
        set_and_go('', '', '');
    });

});

function set_and_go(html, site_id, selector, url){
    chrome.tabs.getSelected(null, function(tab) {
        // put html into the storage
        chrome.storage.local.set({
            html: html,
			site_id: site_id,
            selector: selector,
			url: url
        });

        // reload the tab
        chrome.tabs.reload(tab.id);
    });
}