//localStorage.setItem('collecting_ideas', []);
var items;

function updateJSON(){
    var is_multiline = $('#json_multiline').prop('checked');
    var json = '[';
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
    $('#json').val(json);
    return json;
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
    var json = updateJSON();
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
    })

    updateJSON()
});

    //localStorage.clear()