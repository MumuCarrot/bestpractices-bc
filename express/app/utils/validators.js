export const validateLogin = (login) => {
  return /^(?=(?:.*[a-zA-Z]){3,})[a-zA-Z0-9_-]{3,16}$/.test(login);
};

export const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

export const validateName = (name) => {
  return /^(?=(?:.*[a-zA-Z]){3,})[a-zA-Z0-9_-]{3,16}$/.test(name);
};