export const validateEmail = (email) => {
  var regularExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regularExp.test(email);
};

export const checkPasswordComplexity = (pwd) => {
  var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*_])(?=.*[a-zA-Z]).{6,}$/;
  return regularExpression.test(pwd);
};
export const validatePhoneNumber = (phoneNumber) => {
  var phoneExp = /^\+?[1-9]\d{1,14}$/;
  return phoneExp.test(phoneNumber);
};
