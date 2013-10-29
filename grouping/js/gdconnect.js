/**
 * connect to Google Drive
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.assert');
goog.require('nhiro.fusen');
goog.require('nhiro.log');
goog.require('nhiro.repos');
goog.provide('main.gdcon');

google.load('picker', '1');

// Data are stored in  main.gdcon._list;
// Don't touch it out of the file except for debug purpose

var realtimeLoader;


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
 * update UI
 */
main.gdcon.updateUI = function() {
    var array = main.gdcon._list.asArray();
    var N = main.boxes.length;
    for (var i in array) {
        if (i < N) {
            // box already exists
            // TODO implement updating
        }else {
            // box not exists yet

            /** @type {!Object} */
            var v = /** @type {!Object} */ (JSON.parse(array[i]));
            if (v.x == null && v.y == null) {
                v.x = 142 * (v.id % 10);
                v.y = 92 * (Math.floor(v.id / 10) % 10);
                main.gdcon.updateItem(v.id, v);
            }
            main.add_fusen(v.text, v.x, v.y);
        }
    }
};

/**
 * @param {!Number} id .
 * @param {!Object} params (don't pass Raphael element).
 */
main.gdcon.updateItem = function(id, params) {
    var box = JSON.parse(main.gdcon._list.get(id));
    Object.keys(params).forEach(function(key) {
        box[key] = params[key];
    });
    try {
        main.gdcon._list.set(id, JSON.stringify(box));
    }catch (e) {
        var READONLY = ('Unable to apply local mutation ' +
                        'because document is in read-only mode.');
        var MESSAGE = (
            'Your change will not saved because the document is read-only.');
        if (e.toString().indexOf(READONLY) != -1) {
            nhiro.log(READONLY);
            nhiro.notify.once(MESSAGE);
        }else {
            throw e;
        }
    }
};


/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model.
 * @param {gapi.drive.realtime.Document} doc the Realtime document.
 */
function onFileLoaded(doc) {
    nhiro.notify('Loaded existing document');
    var gapi = nhiro.repos.get('gapi');

    /**
     * @type {gapi.drive.realtime.CollaborativeList}
     */
    main.gdcon._list = doc.getModel().getRoot().get('my_list');
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
    /**
     * @param {{canUndo: boolean, canRedo: boolean}} e .
     */
    var onUndoRedoStateChanged = function(e) {
        undoButton.disabled = !e.canUndo;
        redoButton.disabled = !e.canRedo;
    };

    model.addEventListener(
        gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED,
        onUndoRedoStateChanged);
}

/**
 * @suppress {checkTypes}
 * @this {*}
 */
main.gdcon.onNeedAuth = function() {
    var _this = this;
    nhiro.log('auth needed');
    var $ = nhiro.repos.get('jQuery');
    var box = $('#modal-auth-dialog');
    box.dialog({
        position: {
            my: 'center', at: 'center', of: $('#canvas')},
        resizable: false,
        modal: true,
        buttons: {
            'Log in': function() {
                box.dialog('close');
                _this.authorizeWithPopup();
            }
        },
        open: function() {
            $('.ui-dialog-titlebar-close', box.parentNode).hide();
        }
    });
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
        nhiro.log('no need to auth');
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
    onFileLoaded: onFileLoaded,

    /**
     * Function to be called to inityalize custom Collaborative Objects types.
     */
    registerTypes: null, // No action.

    /**
     * Function to be called after authorization and before loading files.
     */
    afterAuth: function() {
        nhiro.notify('Authorization finished');
    }
};

main.gdcon.pushText = function(text) {
    main.gdcon.pushObj({'text': text});
};
main.gdcon.pushObj = function(obj) {
    nhiro.assert(main.gdcon._list, 'do auth first', true);
    // it may throw exception if you call it before finish initialization
    main.gdcon._list.push(JSON.stringify(obj));
};
/**
 * Start the Realtime loader with the options.
 * @suppress {checkTypes}
 */
main.gdcon.startRealtime = function() {
    var rtclient = nhiro.repos.get('rtclient');
    var $ = nhiro.repos.get('jQuery');
    var gapi = nhiro.repos.get('gapi');

    realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
    realtimeLoader.start();
    setInterval(function() {
        nhiro.log('re-authorizing' + new Date());
        realtimeLoader.authorizer.authorize();
        nhiro.log('re-authorized' + new Date());
    }, 1000 * 60 * 5);  // do auth each 5 minute

    $('#openButton').click(function() {
        // Opens the Google Picker.
        var token = gapi.auth.getToken().access_token;
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes(
            'application/vnd.google-apps.drive-sdk.' +
                realtimeOptions.appId);
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

    $('#saveButton').click(function() {
        var name = $('#nameToSave').val();
        if (name == '') name = 'No Title';
        realtimeLoader.saveAsAndRedirect(name);
    });

    $('#exportAsJSON').click(function() {
        var result = '[';
        var array = main.gdcon._list.asArray();
        var last = array.length - 1;
        for (var i in array) {
            result += array[i];
            if (i < last) result += ', ';
        }
        console.log(result + ']');
    });
};

/**
 * @suppress {checkTypes}
 */
function openCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    realtimeLoader.redirectTo([fileId], realtimeLoader.authorizer.userId);
  }
}
