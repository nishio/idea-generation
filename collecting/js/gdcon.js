/**
 * connect to Google Drive
 * (c) 2013, Cybozu.
 */
goog.provide('main.gdcon');


main.gdcon.startRealtime = function() {
    realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
    realtimeLoader.start();
    setInterval(function() {
        console.log('re-authorizing' + new Date());
        realtimeLoader.authorizer.authorize();
        console.log('re-authorized' + new Date());
    }, 1000 * 60 * 5);  // do auth each 5 minute
};



/**
 * This function is called the first time that the Realtime model is created
 * for a file. This function should be used to initialize any values of the
 * model.
 * @param {gapi.drive.realtime.Model} model the Realtime root model object.
 */
main.gdcon.initializeModel = function(model) {
    var field = model.createList();
    model.getRoot().set('my_list', field);
};


/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model.
 * @param {gapi.drive.realtime.Document} doc the Realtime document.
 */
main.gdcon.onFileLoaded = function onFileLoaded(doc) {
    /**
     * @type {gapi.drive.realtime.CollaborativeList}
     */
    main.gdcon._list = doc.getModel().getRoot().get('my_list');
    console.log('doc');
    console.log(doc);
    $('#docid').text('OK');
    $('#docid').attr(
        'href',
        '../grouping/' +
        '#fileIds=' + rtclient.params['fileIds'] +
        '&userId=' + realtimeLoader.authorizer.userId);

    // push local items into _list
    console.log('merge');
    var _arr = main.gdcon._list.asArray();
    var saved_items = _arr.map(JSON.parse);
    items.forEach(function(item){
        var s = JSON.stringify(item);
        var found = false;
        for(var i=0; i < saved_items.length; i++){
            if(saved_items[i].when == item.when){
                found = true;
                console.log('found');
                break;
            }
        }
        if(!found){
            // not saved yet
            main.gdcon._list.push(s);
            saved_items.push(item);
            console.log('pushed');
        }
    });
    items = saved_items;
    updateJSON();
    updateUI();
    //main.gdcon.updateUI();
};

main.gdcon.push = function(item){
    if(main.gdcon._list){
        main.gdcon._list.push(JSON.stringify(item));
    }
}


/**
 * @this {rtclient.Authorizer}
 */
main.gdcon.onNeedAuth = function() {
    var authorizer = this;
    var b = $('#authButton');
    b.click(function(){
        authorizer.authorizeWithPopup();
        b.hide();
    });
    b.show();
};


/**
 * Options for the Realtime loader.
 */
var realtimeOptions = {
    appId: '240613571940',
    /**
     * Client ID from the APIs Console.
     */
    clientId: '240613571940.apps.googleusercontent.com',

    /**
     * The ID of the button to click to authorize. Must be a DOM element ID.
     */
    authButtonElementId: 'authorizeButton',

    onNeedAuth: main.gdcon.onNeedAuth,
    onNoNeedAuth: function() {
        console.log('no need to auth');
    },

    /**
     * Function to be called when a Realtime model is first created.
     */
    initializeModel: main.gdcon.initializeModel,

    /**
     * Autocreate files right after auth automatically.
     */
    autoCreate: true,

    /**
     * The name of newly created Drive files.
     */
    defaultTitle: 'My Idea',

    /**
     * The MIME type of newly created Drive Files. By default the application
     * specific MIME type will be used:
     *     application/vnd.google-apps.drive-sdk.
     */
    newFileMimeType: null, // Using default.

    /**
     * Function to be called every time a Realtime file is loaded.
     */
    onFileLoaded: main.gdcon.onFileLoaded,

    /**
     * Function to be called to inityalize custom Collaborative Objects types.
     */
    registerTypes: null, // No action.

    /**
     * Function to be called after authorization and before loading files.
     */
    afterAuth: function(){
        console.log('after auth');
        console.log(realtimeLoader);
    }
};
