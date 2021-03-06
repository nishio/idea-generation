/**
 * @typedef {Object}
 */
var console;

/**
 * @param {string} arg1
 */
console.log = function(arg1) {};

/**
 * canvg
 * @param {*} arg1
 * @param {*} arg2
 */
function canvg(arg1, arg2) {}


/**
 * jQuery UI Dialog
 * @param {*} arg1
 */
jQuery.prototype.dialog = function(arg1) {};


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


/**
 * @typedef {Object}
 */
var rtclient;

/** @typedef {Object} */
rtclient.RealtimeLoader;

/** @typedef {{userId: string}} */
rtclient.RealtimeLoader.prototype.autorizer;

rtclient.RealtimeLoader.prototype.autorizer.authorize = function() {};


/** @typedef {Object} */
gapi.auth;

/** @return {OAuthToken} */
gapi.auth.getToken = function() {};

 /** @typedef {{access_token: string, error: string, expires_in: string, state: string}} */
 var OAuthToken;

/** @typedef {Object} */
 var google;

/** @typedef {Object} */
google.picker;

/** @typedef {Object} */
google.picker.View;

/**
 * @constructor
 * @return {google.picker.PickerBuilder}
 */
google.picker.PickerBuilder = function() {};
