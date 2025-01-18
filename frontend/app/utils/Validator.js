const Validator = {
  validateEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },
  
  validateInput: (input, type) => {
    switch(type) {
      case 'email':
        if (!input) return 'Email is required.';
        if (!this.validateEmail(input)) return 'Please enter a valid email address.';
        break;
      case 'password':
        if (!input) return 'Password is required.';
        if (input.length < 6) return 'Password must be at least 6 characters.';
        break;
      case 'username':
        if (!input) return 'Username is required.';
        break;
      default:
        return null;
    }
    return null;
  }
};

export default Validator;
