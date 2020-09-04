//returns a string of 6 random alphanumeric characters
const generateRandomString = () => { //helper function
  return Math.random().toString(36).substring(2, 8);
};

//lookup for existing emails and returns the user if its registered
const getUserByEmail = (email, database) => { // helper function
  for (const key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
};





module.exports = { getUserByEmail, generateRandomString };