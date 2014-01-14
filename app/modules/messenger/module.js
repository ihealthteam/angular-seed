define(['angular'], function (ng) {
  'use strict';

  ng.module('cs_messenger.directives', []);
  ng.module('cs_messenger.providers', []);

  var module = ng.module('cs_messenger', [
    'cs_common',
    'cs_messenger.directives',
    'cs_messenger.providers'
  ]);

  return module;
});
