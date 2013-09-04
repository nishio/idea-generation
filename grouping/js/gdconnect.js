/**
 * connect to Google Drive
 * (c) 2013, Cybozu.
 */
goog.provide('main.gdcon');

google.load('picker', '1');

var my_list;

/**
 * This function is called the first time that the Realtime model is created
 * for a file. This function should be used to initialize any values of the
 * model.
 * @param model {gapi.drive.realtime.Model} the Realtime root model object.
 */
main.gdcon.initializeModel = function(model){
    var field = model.createList();
    field.pushAll(['test1', 'test2']);
    model.getRoot().set('my_list', field);
}

main.gdcon.updateUI = function() {
    var $ = nhiro.repos.get('jQuery');
    $('#list').empty();
    var array = my_list.asArray();
    for (var i in array) {
        var new_item = $('<li>').text(array[i]);
        $('#list').append(new_item);
    }
};

/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model.
 * @param doc {gapi.drive.realtime.Document} the Realtime document.
 */
function onFileLoaded(doc) {
    var gapi = nhiro.repos.get('gapi');

    my_list = doc.getModel().getRoot().get('my_list');
    main.gdcon.updateUI();


    // Add logic for undo button.
    var model = doc.getModel();
    var undoButton = document.getElementById('undoButton');
    var redoButton = document.getElementById('redoButton');

    undoButton.onclick = function(e) {
        model.undo();
        main.gdcon.updateUI();
    };
    redoButton.onclick = function(e) {
        model.redo();
        main.gdcon.updateUI();
    };

    // Add event handler for UndoRedoStateChanged events.
    var onUndoRedoStateChanged = function(e) {
        undoButton.disabled = !e.canUndo;
        redoButton.disabled = !e.canRedo;
    };
    model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);
}

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
  defaultTitle: "My Idea",

  /**
   * The MIME type of newly created Drive Files. By default the application
   * specific MIME type will be used:
   *     application/vnd.google-apps.drive-sdk.
   */
  newFileMimeType: null, // Using default.

  /**
   * Function to be called every time a Realtime file is loaded.
   */
  onFileLoaded: onFileLoaded,

  /**
   * Function to be called to inityalize custom Collaborative Objects types.
   */
  registerTypes: null, // No action.

  /**
   * Function to be called after authorization and before loading files.
   */
  afterAuth: null // No action.
}

/**
 * Start the Realtime loader with the options.
 */
 var realtimeLoader
main.gdcon.startRealtime = function() {
    var rtclient = nhiro.repos.get('rtclient');
    var $ = nhiro.repos.get('jQuery');
    var gapi = nhiro.repos.get('gapi');

    realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
    realtimeLoader.start();

    $('#add_texts').click(function(){
        var items = $('#texts').val().split(/\n\s*/g);
        items.forEach(function(x){
            my_list.push(x);
        });
        main.gdcon.updateUI();
    });

    $('#openButton').click(function(){
        // Opens the Google Picker.
        var token = gapi.auth.getToken().access_token;
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("application/vnd.google-apps.drive-sdk." + realtimeOptions.appId);
        var picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setAppId(realtimeOptions.appId)
        .setOAuthToken(token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setCallback(openCallback)
        .build();
        picker.setVisible(true);
    });
}

function openCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    realtimeLoader.redirectTo([fileId], realtimeLoader.authorizer.userId);
  }
}
