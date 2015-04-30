describe('Divona Angular Mandrill module', function() {
    var $rootScope, $httpBackend, $q;
    var Mandrill, MANDRILL_API_URL;
    var MANDRILL_APIKEY = 'MOCK_VALID_KEY';
    var pingRequestHandler;

    // Set up the module
    beforeEach(module('divonaNgMandrill', function($provide) {
        $provide.constant('MANDRILL_APIKEY', MANDRILL_APIKEY);
    }));

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');

        Mandrill = $injector.get('Mandrill');
        MANDRILL_API_URL = $injector.get('MANDRILL_API_URL');

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // backend definition common for all tests
        pingRequestHandler = $httpBackend.when('POST', MANDRILL_API_URL+'users/ping2.json?key='+MANDRILL_APIKEY)
          .respond({"PING":"PONG!"});
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have a ping method', function () {
        expect(Mandrill.ping).toBeDefined();
    });

    it('should be able to ping Mandrill with a key', function() {
        $httpBackend.expectPOST(MANDRILL_API_URL+'users/ping2.json?key='+MANDRILL_APIKEY);
        Mandrill.ping().then(function (response) {
            expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
    });
});