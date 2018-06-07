import { getStriimIdType } from '../searchBarHelpers';

describe('getStriimIdType', () => {
  it('correctly returns wallet type', () => {
    expect(getStriimIdType('1231')).toEqual('wallet');
  });

  it('correctly returns order type', () => {
    expect(getStriimIdType('2')).toEqual('order');
  });

  it('correctly returns deal type', () => {
    expect(getStriimIdType('3')).toEqual('deal');
  });

  it('correctly returns deposit type', () => {
    expect(getStriimIdType('4231')).toEqual('deposit');
  });

  it('correctly returns withdrawal type', () => {
    expect(getStriimIdType('5231')).toEqual('withdrawal');
  });

  it('correctly returns settlement type', () => {
    expect(getStriimIdType('6231')).toEqual('settlement');
  });

  it('correctly returns null for unknown type', () => {
    expect(getStriimIdType('9231')).toBeNull();
  });

  it('correctly returns null for too long type', () => {
    expect(getStriimIdType('623111111111111111')).toBeNull();
  });
});
