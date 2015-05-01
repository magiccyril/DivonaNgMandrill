describe('Divona Angular Mandrill module', function () {
  var $rootScope, $httpBackend, $q;
  var Mandrill, MANDRILL_API_URL;
  var MANDRILL_APIKEY = 'MOCK_VALID_KEY';
  var sendMessageHandler;
  var message = {
    'subject': "subject",
    'text': "message",
    'from_email': "from@example.com",
    'from_name': "From name",
    'to': [
      {
        'email': "to@example.com",
        'name': "To name",
        'type': "to"
      }
    ]
  };

  // Set up the module
  beforeEach(module('divonaNgMandrill', function ($provide) {
    $provide.constant('MANDRILL_APIKEY', MANDRILL_APIKEY);
  }));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');

    Mandrill = $injector.get('Mandrill');
    MANDRILL_API_URL = $injector.get('MANDRILL_API_URL');

    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');

    // backend definition
    // Ping response.
    $httpBackend.when('POST', MANDRILL_API_URL + 'users/ping2.json?key=' + MANDRILL_APIKEY)
      .respond({"PING": "PONG!"});

    // Valid send message response.
    sendMessageHandler = $httpBackend.when('POST'
      , MANDRILL_API_URL + 'messages/send.json'
      , { "key": MANDRILL_APIKEY, "message": message }
    ).respond([{ "status": "sent" }]);
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a ping method', function () {
    expect(Mandrill.ping).toBeDefined();
  });

  it('should be able to ping Mandrill with a key', function () {
    $httpBackend.expectPOST(MANDRILL_API_URL + 'users/ping2.json?key=' + MANDRILL_APIKEY);
    Mandrill.ping().then(function (response) {
      expect(response.status).toEqual(200);
    });
    $httpBackend.flush();
  });

  it('should have a sendMessage method', function () {
    expect(Mandrill.sendMessage).toBeDefined();
  });

  it('should be able to send a message', function () {
    $httpBackend.expectPOST(MANDRILL_API_URL + 'messages/send.json', { "key": MANDRILL_APIKEY, "message": message });
    Mandrill.sendMessage(message).then(function (response) {
      expect(response).toBeTruthy();
    });
    $httpBackend.flush();
  });

  it('should be handle rejected messages', function () {
    // Rejected message.
    sendMessageHandler.respond([{ "status": "rejected" }]);
    $httpBackend.expectPOST(MANDRILL_API_URL + 'messages/send.json', { "key": MANDRILL_APIKEY, "message": message });
    Mandrill.sendMessage(message).then(function (response) {
      expect(response).toBeFalsy();
    });
    $httpBackend.flush();

    // Invalid message.
    sendMessageHandler.respond([{ "status": "invalid" }]);
    $httpBackend.expectPOST(MANDRILL_API_URL + 'messages/send.json', { "key": MANDRILL_APIKEY, "message": message });
    Mandrill.sendMessage(message).then(function (response) {
      expect(response).toBeFalsy();
    });
    $httpBackend.flush();
  });
});