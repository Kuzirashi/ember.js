import isPlainFunction from 'ember-debug/is-plain-function';
import deprecate from 'ember-debug/deprecate';

export let HANDLERS = { };
export let testAsFunctionDeprecation = 'Functional arguments are ambiguous with constructors.' +
  'Please use !!Constructor for constructors, or an IIFE to compute the deprecation value.' +
  'In a future version of Ember functions will be treated as truthy values instead of being executed.';

function normalizeTest(test) {
  if (isPlainFunction(test)) {
    deprecate(
      testAsFunctionDeprecation,
      false,
      { id: 'ember-debug.deprecate-test-as-function', until: '3.0.0' }
    );

    return test();
  }

  return test;
}

export function registerHandler(type, callback) {
  let nextHandler = HANDLERS[type] || function() { };

  HANDLERS[type] = function(message, options) {
    callback(message, options, nextHandler);
  };
}

export function invoke(type, message, test, options) {
  if (normalizeTest(test)) { return; }

  let handlerForType = HANDLERS[type];

  if (!handlerForType) { return; }

  if (handlerForType) {
    handlerForType(message, options);
  }
}
