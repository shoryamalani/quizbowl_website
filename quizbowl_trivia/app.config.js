// Example app.config.js where the bundle identifier and package name are
// swapped out depending on an environment variable
module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        ios: { bundleIdentifier: 'com.clearpointmanagement.quizbowl-trivia' },
        android: { package: 'com.clearpointmanagement.quizbowl_trivia' },
      };
    } else {
      return {
        ios: { bundleIdentifier: 'com.clearpointmanagement.quizbowl-trivia.dev' },
        android: { package: 'com.clearpointmanagement.quizbowl_trivia.dev' },
      };
    }
  };
  