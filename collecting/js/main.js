var items;
var json;

function updateJSON(){
    var is_multiline = $('#json_multiline').prop('checked');
    json = '[';
    var first = true;
    items.forEach(function(item){
        if(!first){
            json += ',';
        }
        if(is_multiline) json += '\n  ';
        json += JSON.stringify(item);
        first = false;
    })
    if(is_multiline) json += '\n';
    json += ']';
    return json;
}

function updateUI(){
    $('#list_header').text('List: ' + items.length);
    $('#json').val(json);
}

function update(){
    var text = $('#text').val();
    var id = items.length;
    var when = new Date().toISOString();
    var item = {
        'text': text,
        'when': when,
        'id': id};

    $('input[type=text]').each(function(i, x){
        if(x.value != ''){
            item[x.id] = x.value;
        }
    })
    items.push(item);

    // clear
    $('#text').val('');
    $('#pages').val('');
    $('#original_text').val('');

    // update JSON
    updateJSON();

    updateUI();
    localStorage.setItem('collecting_ideas', json);
}

$(function(){
    items = localStorage.getItem('collecting_ideas');
    try{
        if(items == null){
            items = [];
        }else{
            items = JSON.parse(items);
        }
    }catch(e){
        console.log(items);
        console.log('cannot understand as JSON')
        items = [];
    }

    $('input[type=text]').keypress(function(e) {
        if (e.keyCode == 13) update();
    });
    $('#text').keypress(function(e) {
        if (e.keyCode == 13){
            update();
            return false;
        }
    });

    $('#json_multiline').click(function(){
        updateJSON();
        updateUI();
    })

    // update AppCache
    window.applicationCache.addEventListener(
        "updateready", function() {
            window.applicationCache.swapCache();
            location.reload();
        }
    );
    $('#updateAppCache').click(function(){
        window.applicationCache.update();
    });

    updateJSON();
    updateUI();
    if(!nhiro.is_online){
        $('#is_online').text('offline');
    }
});

