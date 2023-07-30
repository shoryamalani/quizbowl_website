// Example app.config.js where the bundle identifier and package name are
// swapped out depending on an environment variable
export default {
    "name": "Trivia SLAM",
    ios:{
    "supportsTablet": true,
    "icon": "./app/assets/questionMarkIcon.png",
    "bundleIdentifier": "com.clearpointmanagement.quizbowl-trivia.dev",
    "config": {
    "usesNonExemptEncryption": false
    }
    },

    android:{
      "package": "com.smalani.quizbowl_trivia.dev",
    },
    "extra": {
      "eas": {
        "projectId": "a6594206-ec97-4577-9649-7a04ef1af693"
      }
    }

    
  };
  
 