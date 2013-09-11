$(function(){
    chrome.storage.local.get(null, function (data) {
        if (data) {
            // init window script
            $.getScript('http://dev.backend.cliqueme.com/inject?site_id='+ data.site_id +'&selector=' + encodeURIComponent(data.selector), function(){
                console.log(window.cliqueme);

                $.getScript(data.url);
                $('body').append(data.html);
            })
        }
    });
});
