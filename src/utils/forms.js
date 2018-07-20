/**
 * Helper functions for Forms
 */

export function compareToFirstPassword(form, rule, value, callback) {
  if (value && value !== form.getFieldValue('password')) {
    callback('Two passwords that you enter is inconsistent!');
  } else {
    callback();
  }
}

export function handleFinish(e, form, handleNext, extraValues = {}) {
  e.preventDefault();
  form.validateFields((err, values) => {
    if (!err && handleNext) {
      Object.entries(values).forEach(
        ([key, value]) => values[key] === value.trim()
      );
      handleNext({ ...values, ...extraValues });
    }
  });
}
