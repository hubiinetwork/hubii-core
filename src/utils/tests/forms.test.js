import { compareToFirstPassword, handleFinish } from '../forms';

describe('Form Helper Functions', () => {
  describe('compareToFirstPassword function', () => {
    const form = {
      getFieldValue: jest.fn(),
    };
    const callback = jest.fn();
    const rule = null;
    let value;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should run compareToFirstPassword with invalid password', () => {
      value = 'none';
      form.getFieldValue = jest.fn().mockReturnValueOnce('123123');
      compareToFirstPassword(form, rule, value, callback);
      expect(form.getFieldValue).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('Two passwords that you enter is inconsistent!');
    });
    it('should run compareToFirstPassword with valid password', () => {
      value = '123123';
      form.getFieldValue = jest.fn().mockReturnValueOnce('123123');
      compareToFirstPassword(form, rule, value, callback);
      expect(form.getFieldValue).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith();
    });
  });


  describe('handleFinish function', () => {
    const form = {
      getFieldValue: jest.fn(),
      validateFields: jest.fn(),
    };
    const e = {
      preventDefault: jest.fn(),
    };
    const handleNext = jest.fn();
    it('should run handleFinish', () => {
      handleFinish(e, form, handleNext);
      expect(form.validateFields).toHaveBeenCalledTimes(1);
      expect(e.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
