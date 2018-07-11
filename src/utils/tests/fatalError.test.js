import fatalError from '../fatalError';

describe('fatalError', () => {
  it('should alert and exit the process', () => {
    const realProcess = process;
    const realAlert = alert;
    const exitMock = jest.fn();
    const alertMock = jest.fn();
    global.process = { ...realProcess, exit: exitMock };
    global.alert = alertMock;

    fatalError('some error');
    expect(exitMock).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalled();
    global.process = realProcess;
    global.alert = realAlert;
  });
});
