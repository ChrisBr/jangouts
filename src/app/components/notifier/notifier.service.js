/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('Notifier',  Notifier);

  Notifier.$inject = ['$animate', 'toastr'];

  function Notifier($animate, toastr) {
    this.info = info;

    function info(text) {
      toastr.info('', text);
    }
  }
}());
