// Field lavel validation
// const required = value => value ? undefined : 'Required';
// const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
// const maxLength15 = maxLength(15);
// const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;

// Form validation
const validate = (values) => {
  const error = {};
  if (!values.email || values.email.trim() === "") {
    error.email = "Please enter email address.";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    if (!values.email) {
      error.email = "Please enter email address.";
    } else {
      error.email = "Please enter a valid email address.";
    }
  }
  if (!values.password || values.password.trim() === "") {
    error.password = "Please enter password.";
  }
  // To check a password between 6 to 20 characters which contain at least
  // one numeric digit,
  // one uppercase, and //(?=.*[A-Z])
  // one lowercase letter //(?=.*[a-z])

  let passw = /^.{6,12}$/;
  if (values.password && !passw.test(values.password)) {
    error.password = "Password must be between 6 and 12 characters.";
  }

  if (!values.confirm_password || values.confirm_password.trim() === "") {
    error.confirm_password = "Please enter confirm password.";
  }
  // treatment goals

  if (!values.treatment_goal) {
    error.treatment_goal = "Please share your treatment goals.";
  }

  if (values.password && values.confirm_password && (values.password !== values.confirm_password)) {
    error.confirm_password = "Password doesn\'t match with confirm password.";
  }

  if (!values.newpassword || values.newpassword.trim() === "") {
    error.newpassword = "Please enter a password.";
  }
  if (values.newpassword && values.confirm_password && (values.newpassword !== values.confirm_password)) {
    error.confirm_password = "New password doesn\'t match with confirm password.";
  }

  if (values.newpassword && values.confirm_password && (values.newpassword !== values.confirm_password)) {
    error.confirm_password = "New password doesn\'t match with confirm password.";
  }

  // Firstname
  if (!values.first_name || values.first_name.trim() === "") {
    error.first_name = "Please enter first name.";
  } else {
    values.first_name = values.first_name.trim();
  }
  // console.log("firstname regex", /^[a-zA-Z]+$/.test(values.first_name.trim()));

  if (values.first_name && !/^[a-zA-Z]+$/.test(values.first_name)) {
    error.first_name = "First name can only consists of letters. Spaces, numbers and special characters are not allowed.";
  } else if (values.first_name && (values.first_name.length < 3 || values.first_name.length > 30)) {
    if (values.first_name.length < 3) {
      error.first_name = "First name should be atleast 3 characters long.";
    }
    if (values.first_name.length > 30) {
      error.first_name = "First name should not be greater than 30 characters long.";
    }
  }

  // lastname
  if (!values.last_name || values.last_name.trim() === "") {
    error.last_name = "Please enter last name.";
  } else {
    values.last_name = values.last_name.trim();
  }
  if (values.last_name && !/^[a-zA-Z]+$/.test(values.last_name)) {
    error.last_name = "Last name can only consists of letters. Spaces, numbers and special characters are not allowed.";
  } else if (values.last_name && (values.last_name.length < 3 || values.last_name.length > 30)) {
    if (values.last_name.length < 3) {
      error.last_name = "Last name should be atleast 3 characters long.";
    }
    if (values.last_name.length > 30) {
      error.last_name = "Last name should not be greater than 30 characters long.";
    }
  }

  // caregiver name
  if (!values.care_giver_name) {
    error.care_giver_name = "Please enter Name";
  }
  if (!values.care_giver_phone) {
    error.care_giver_phone = "Please enter Phone number";
  }
  if (!values.care_giver_email) {
    error.care_giver_email = "Please enter email";
  }
  if (values.care_giver_name) {
    // values.care_giver_name = values.care_giver_name.trim();
    if (!/^[a-zA-Z ]+$/.test(values.care_giver_name)) {
      error.care_giver_name = "Caregiver name can only consists of letters. Numbers and special characters are not allowed.";
    } else if (values.last_name.length < 3) {
      error.last_name = "Caregiver name should be atleast 3 characters long.";
    } else if (values.last_name.length > 30) {
      error.last_name = "Caregiver name should not be greater than 30 characters long.";
    }
  }
  if (values.care_giver_phone) {
    // values.care_giver_name = values.care_giver_name.trim();
    if (!/^[0-9 -]+$/.test(values.care_giver_phone)) {
      error.care_giver_phone = "Caregiver contact number can only consists of numbers and '-'. Alphabets and other special characters are not allowed.";
    } else if (values.care_giver_phone.length < 12) {
      error.care_giver_phone = "Caregiver contact number should be atleast 10 characters long.";
    }
    // } else if (values.care_giver_phone.length > 14) {
    //   error.care_giver_phone = "Caregiver contact number should not be greater than 14 characters long.";
    // }
  }
  if (values.care_giver_email) {
    values.care_giver_email = values.care_giver_email.trim();
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.care_giver_email)) {
      error.care_giver_email = "Please enter a valid email address.";
    }
  }


  if (!values.dob) {
    error.dob_month = "Please select date of birth.";
  }

  if (!values.race) {
    error.race = "Please select race.";
  }
  if (typeof (values.initial_diagnosis) === undefined || !values.initial_diagnosis) {
    error.initial_diagnosis = "Please select initial diagnosisssss.";
  }

  if (!values.zipcode) {
    error.zipcode = "Please enter zip code.";
  }
  if (values.zipcode) {
    values.zipcode = isNaN(Number(values.zipcode)) ? "" : values.zipcode;
  }
  if (!values.agreed) {
    error.agreed = "Please check privacy policy.";
  }

  if (!values.accepted_understand_clause) {
    error.accepted_understand_clause = "Please check license agreement.";
  }
  if (!values.contact_number) {
    // || values.contact_number.trim() === ""
    error.contact_number = "Please enter contact number.";
  }

  if (!values.ssn || (values.ssn && (values.ssn).length < 4)) {
    // || values.ssn.trim() === ""
    error.ssn = "Please last 4 digits of your Social Security Number.";
  }
  if (!values.portal_username || values.portal_username.trim() === "") {
    error.portal_username = "Please enter your portal username.";
  }
  if (!values.portal_password || values.portal_password.trim() === "") {
    error.portal_password = "Please enter your portal password.";
  }
  if (!values.portal_url || values.portal_url.trim() === "") {
    error.portal_url = "Please enter your portal url.";
  }
  return error;
};

export default validate;
