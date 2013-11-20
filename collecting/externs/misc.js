/**
 * @typedef {Object}
 */
var console;

/**
 * @param {*} arg1
 */
console.log = function(arg1) {};


/**
 * @typedef {Object}
 */
var localStorage;


/**
 * @typedef {Object}
 */
var rtclient;

/**
 * @typedef {Object}
 */
rtclient.params;

/** @typedef {Object} */
rtclient.RealtimeLoader;

/** @typedef {Object} */
rtclient.Authorizer

 /** @typedef {rtclient.Authorizer} */
rtclient.RealtimeLoader.autorizer;

 /** @typedef {String} */
rtclient.RealtimeLoader.autorizer.userId;

rtclient.Authorizer.prototype.authorize = function() {};

rtclient.Authorizer.prototype.authorizeWithPopup = function() {};


/**
 * @typedef {Object}
 */
var nhiro;

/** @typedef {Boolean} */
nhiro.is_online;



/**
 * @typedef {Object}
 */
var gapi;

/**
 * @typedef {Object}
 */
gapi.drive;

/**
 * @typedef {Object}
 */
gapi.drive.realtime;

/**
 * @typedef {Object}
 */
gapi.drive.realtime.Document;

/**
 * @return {gapi.drive.realtime.Model} .
 */
 gapi.drive.realtime.Document.prototype.getModel = function() {};

/**
 * @typedef {Object}
 */
gapi.drive.realtime.Model;


/**
 * @return {Object} .
 */
gapi.drive.realtime.Model.prototype.createList = function() {};

/**
 * @return {Object} .
 */
gapi.drive.realtime.Model.prototype.getRoot = function() {};

/**
 * @return {Object} .
 */
gapi.drive.realtime.Model.prototype.undo = function() {};

/**
 * @return {Object} .
 */
gapi.drive.realtime.Model.prototype.redo = function() {};

/**
 * @typedef {Object}
 */
 gapi.drive.realtime.CollaborativeList;

/**
 * @return {Array} .
 */
 gapi.drive.realtime.CollaborativeList.prototype.asArray = function() {};
