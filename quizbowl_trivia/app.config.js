// Example app.config.js where the bundle identifier and package name are
// swapped out depending on an environment variable
export default {
    ios:{
    "name": "Trivia SLAM",
    "supportsTablet": true,
    "icon": "./app/assets/questionMarkIcon.png",
    "bundleIdentifier": "com.clearpointmanagement.quizbowl-trivia.dev",
    "config": {
    "usesNonExemptEncryption": false
    }
    }
  };
  
 