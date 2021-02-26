module.exports = (sequalize, Sequalize) => {
  const User = sequalize.define("users", {
    username: {
      type: Sequalize.STRING,
    },
    email: {
      type: Sequalize.STRING,
    },
    password: {
      type: Sequalize.STRING,
    },
  });

  return User;
};
