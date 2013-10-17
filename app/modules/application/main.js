require.config({
  packages: [
    {
      name: 'cs_common',
      location: '/modules/cs_common'
    },
    {
      name: 'cs_session',
      location: '/modules/cs_session'
    }
  ],
  baseUrl: '/modules/application',
  paths: {
    angular: '/components/angular-unstable/angular'
  },
  shim: {
    angular: {
      exports: 'angular'
    }
  }
});

define([
  'angular',
  './bootstrap',
  './config',
  'cs_common',
  'cs_session'
], function (ng){
  'use strict';

  ng.element(document).ready(function () {
    ng.bootstrap(document, ['app']);
  });

});
