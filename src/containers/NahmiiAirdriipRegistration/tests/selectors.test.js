import { fromJS } from 'immutable';
import { makeSelectNahmiiAirdriipRegistration } from '../selectors';
import { nahmiiAirdriipRegistrationMock } from './mocks/selectors';

describe('selectNahmiiAirdriipRegistrationDomain', () => {
  it('should select nahmiiAirdriipRegistration state', () => {
    const nahmiiAirdriipRegistrationSelector = makeSelectNahmiiAirdriipRegistration();
    const mockedState = fromJS({
      nahmiiAirdriipRegistration: nahmiiAirdriipRegistrationMock,
    });
    expect(nahmiiAirdriipRegistrationSelector(mockedState))
      .toEqual(nahmiiAirdriipRegistrationMock);
  });
});
