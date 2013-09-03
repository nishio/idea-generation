/**
 * State manager library.
 * (c) 2013, Cybozu.
 */

goog.provide('nhiro.stateman');
goog.require('nhiro.assert');
/**
 * State Manager
 */
nhiro.stateman = (function create_stateman() {
    var stateman = {};

    /** @type {Object.<string, nhiro.stateman.State>} */
    // state_table should be private
    var state_table = {};

    function empty_state() {
        var result = {};
        result.enter = null;
        result.exit = null;
        result.handler_table = {};
        return result;
    }
    /**
     * @param {string} name .
     */
    stateman.make_empty_state = function make_empty_state(name) {
        var result = empty_state();
        nhiro.assert.assert(state_table[name] == null);
        state_table[name] = result;
    }

    /** @type {nhiro.stateman.State} */
    // current_state should be private
    var current_state = empty_state();

    /**
     * @param {string} target_type .
     * @param {string} message .
     * @param {*} target .
     * @param {(Object|null|undefined)} args .
     */
    stateman.trigger = function trigger(target_type, message, target, args) {
        var handler = current_state.handler_table[target_type + ' ' + message];
        if (handler == null) return;
        handler.apply(target, args);
    }

    /**
     * @param {string} state .
     */
    stateman.go = function go(state) {
        if (current_state != null) {
            if (current_state.exit != null) {
                current_state.exit();
            }
        }
        var cur = state_table[state];
        nhiro.assert.assert(cur != null);
        current_state = cur;
        if (cur.enter != null) {
            cur.enter();
        }
    }

    /**
     * @param {string} state_name .
     * @param {string} target_type .
     * @param {string} message .
     * @param {function (*, (Array|null))} handler .
     */
    stateman.add_handler = function add_handler(
        state_name, target_type, message, handler) {

        var sig = target_type + ' ' + message;
        var state = state_table[state_name];
        nhiro.assert.assert(state != null);
        nhiro.assert.assert(state.handler_table[sig] == null);
        state.handler_table[sig] = handler;
    }

    /**
     * @param {string} state_name .
     * @param {string} target_type .
     * @param {string} message .
     */
    stateman.remove_handler = function remove_handler(
        state_name, target_type, message) {

        var sig = target_type + ' ' + message;
        var state = state_table[state_name];
        nhiro.assert.assert(state != null);
        nhiro.assert.assert(current_state.handler_table[sig] != null);
        state.handler_table[sig] = null;
    }

    stateman.add_exit = function add_exit(state_name, handler) {
        var state = state_table[state_name];
        nhiro.assert.assert(state != null);
        nhiro.assert.assert(state.exit == null);
        state.exit = handler;
    }

    stateman.add_enter = function add_enter(state_name, handler) {
        var state = state_table[state_name];
        nhiro.assert.assert(state != null);
        nhiro.assert.assert(state.enter == null);
        state.enter = handler;
    }

    stateman.create_stateman = create_stateman;
    return stateman;
})();

/** @typedef
    {{exit: function()?, enter: function()?,
      handler_table: nhiro.stateman.HandlerTable}} */
nhiro.stateman.State;

/** @typedef {function(*, Array.<*>)} */
nhiro.stateman.Handler;

/** @typedef {Object.<string, nhiro.stateman.Handler?>} */
nhiro.stateman.HandlerTable;
