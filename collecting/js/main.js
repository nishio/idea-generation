/**
 * grouping
 * (c) 2013, Cybozu.
 */
goog.require('main.gdcon');
goog.provide('main.main');

var items;
var json;

function updateJSON() {
    var is_multiline = $('#json_multiline').prop('checked');
    json = '[';
    var first = true;
    items.forEach(function(item) {
        if (!first) {
            json += ',';
        }
        if (is_multiline) json += '\n  ';
        json += JSON.stringify(item);
        first = false;
    });
    if (is_multiline) json += '\n';
    json += ']';
    return json;
}

function updateUI() {
    $('#list_header').text('List: ' + items.length);
    $('#json').val(json);

    $('#list').empty();
    items.forEach(function(item) {
        var bq = $('<blockquote>');
        bq.text(item['text']);
        $('#list').append(bq);
    });

    scroll();
}

function scroll(){
    var bottom = $(window).height() + $(window).scrollTop();
    var div = $('#inputarea');
    var div_bottom = div.offset().top  + div.height();
    console.log(div_bottom);
    console.log(bottom);
    if(div_bottom > bottom){
        $(window).scrollTop(
            $(window).scrollTop() + div_bottom - bottom
        );
    }
}

function add_item() {
    var text = $('#text').val();
    var id = items.length;
    var when = new Date().toISOString();
    var item = {
        'text': text,
        'when': when,
        'id': id};

    $('input[type=text]').each(function(i, x) {
        if (x.value != '') {
            item[x.id] = x.value;
        }
    });
    items.push(item);
    main.gdcon.push(item);

    // clear
    $('#text').val('');
    $('#pages').val('');
    $('#original_text').val('');

    $('#text').focus();

    update();
}

function update() {
    updateJSON();
    updateUI();
    localStorage.setItem('collecting_ideas', json);
}

var realtimeLoader;
function startRealtime() {
    realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
    realtimeLoader.start();
    setInterval(function() {
        console.log('re-authorizing' + new Date());
        realtimeLoader.authorizer.authorize();
        console.log('re-authorized' + new Date());
    }, 1000 * 60 * 5);  // do auth each 5 minute

}

function load_json(data){
    try {
        if (data == null) {
            items = [];
        }else {
            items = JSON.parse(data);
        }
    }catch (e) {
        console.log(data);
        console.log('cannot understand as JSON');
        items = [];
    }
}

$(function() {
    load_json(localStorage.getItem('collecting_ideas'));

    $('#inputarea input[type=text]').keypress(function(e) {
        if (e.keyCode == 13) add_item();
    });
    $('#text').keypress(function(e) {
        if (e.keyCode == 13) {
            add_item();
            return false;
        }
    });

    $('#json_multiline').click(function() {
        updateJSON();
        updateUI();
    });

    // update AppCache
    window.applicationCache.addEventListener(
        'updateready', function() {
            window.applicationCache.swapCache();
            location.reload();
        },
        false
    );
    $('#updateAppCache').click(function() {
        window.applicationCache.update();
    });

    updateJSON();
    updateUI();
    /*
    if (!nhiro.is_online) {
        $('#is_online').text('offline');
    }
    */


    $('#connectGoogleDrive').click(function() {
        main.gdcon.startRealtime();
    });

    $('#save').click(function(){
        $.post('/api/save', {'filename': $('#filename').val(), 'data': json});
    });

    $('#load').click(function(){
        $.post('/api/load', {'filename': $('#filename').val()}, function(data){
            load_json(data);
        });
    });

    $('#clear').click(function(){
        items = [];
        update();
    });
});

