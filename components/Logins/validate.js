const validate = (values) => {
  const error = {};
  if (!values.username) {
    error.username = "Please enter username";
  }
  let usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  console.log("usernameRegex.test(values.username)", usernameRegex.test(values.username));
  if (values.username && !usernameRegex.test(values.username)) {
    // console.log("i am here in username");
    // error.username = "Username should start with letter and can only contain letters and _.";
  }
  if (!values.email) {
    error.email = "Please enter email address.";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    if (!values.email) {
      error.email = "Please enter email address.";
    } else {
      error.email = "Please enter a valid email address.";
    }
  }
  if (!values.password) {
    error.password = "Please enter password.";
  }
  // To check a password between 6 to 20 characters which contain at least
  // one numeric digit,
  // one uppercase, and //(?=.*[A-Z])
  // one lowercase letter //(?=.*[a-z])

  let passw = /^.{6,12}$/;
  if (values.password && !passw.test(values.password)) {
    // error.password = "Password must be between 6 and 12 characters.";
  }

  if (!values.confirm_password) {
    error.confirm_password = "Please enter confirm password.";
  }
  if (values.password && values.confirm_password && (values.password !== values.confirm_password)) {
    error.confirm_password = "Password doesn't match with confirm password.";
  }

  if (!values.newpassword) {
    error.newpassword = "Please enter a password.";
  }
  if (values.newpassword && values.confirm_password && (values.newpassword !== values.confirm_password)) {
    error.confirm_password = "New password doesn't match with confirm password.";
  }
  return error;
};

export default validate;
