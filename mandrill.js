(function (window, angular, undefined) {'use strict';

  /**
   * @ngdoc module
   * @name divonaNgMandrill
   * @description
   *
   * # divonaNgMandrill
   *
   * The `divonaNgMandrill` module provides basic services to send mail using Mandrill.
   * MANDRILL_APIKEY constant needs to be defined.
   * There's only two methods : ping(), and sendMessage(message).
   *
   */

  var divonaNgMandrill = angular.module('divonaNgMandrill', []);

  divonaNgMandrill.constant('MANDRILL_API_URL', 'https://mandrillapp.com/api/1.0/');

  divonaNgMandrill.factory('Mandrill', ['$http', '$q', 'MANDRILL_APIKEY', 'MANDRILL_API_URL',
    function ($http, $q, MANDRILL_APIKEY, MANDRILL_API_URL) {
      /**
       * Ping Mandrill to check if everything is OK.
       *
       * @returns Pong
       */
      var ping = function () {
        return $http({
          method: 'POST',
          url: MANDRILL_API_URL + '/users/ping2.json',
          params: {
            'key': MANDRILL_APIKEY
          }
        });
      };

      /**
       * Send an email.
       *
       * @param message
       *  Mandrill message object
       *  see @https://mandrillapp.com/api/docs/messages.JSON.html#method=send
       * @returns Boolean
       */
      var send = function (message) {
        return $http.post(MANDRILL_API_URL + '/messages/send.json', {
          'key': MANDRILL_APIKEY,
          'message': message
        }).then(function (response) {
          var data = response.data;

          var i = 0;
          var success = true;
          if (0 === data.length) {
            success = false;
          }
          while (success && i < data.length) {
            if (data[i].status === 'rejected' || data[i].status === 'invalid') {
              success = false;
            }

            i++;
          }

          if (!success) {
            return $q.reject();
          }

          return true;
        });
      };

      return {
        'ping': ping,
        'sendMessage': send
      };
    }
  ]);
})(window, window.angular);
