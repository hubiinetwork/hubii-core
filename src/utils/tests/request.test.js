import request, { checkStatus, parseJSON } from '../request';

describe('request', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('calls custom endpoint and returns data', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'foobar' }));

    request('helloworld', {}, 'http://www.apiendpoint.com/').then((res) => {
      expect(res.data).toEqual('foobar');
    });
  });

  it('calls default endpoint and returns', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'foobar' }));

    request('helloworld', {}).then((res) => {
      expect(res.data).toEqual('foobar');
    });
  });
  describe('checkStatus', () => {
    it('returns response for success status codes', () => {
      const response = { status: 200, body: 'success!' };
      expect(checkStatus(response)).toEqual(response);
    });

    it('throws an error for fail status codes', () => {
      const response = { status: 300, statusText: 'some error' };
      expect(() => checkStatus(response)).toThrow();
    });

    describe('parseJSON', () => {
      it('returns null for response 204', () => {
        const response = { status: 204 };
        expect(parseJSON(response)).toBeNull();
      });

      it('returns null for response 205', () => {
        const response = { status: 205 };
        expect(parseJSON(response)).toBeNull();
      });
    });
  });
});
