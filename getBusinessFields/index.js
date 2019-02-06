var firebase = require('firebase'); 
 
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;  //<---Important
    
    var config = {
        apiKey: "AIzaSyDB9Jj5Fvm6Q6ee9-CPMSz0MU_1M1jeUS0",
        authDomain: "sya-app.firebaseapp.com",
        databaseURL: "https://sya-app.firebaseio.com",
        projectId: "sya-app",
        storageBucket: "sya-app.appspot.com",
        messagingSenderId: "490982978690"
      };
      if(firebase.apps.length == 0) {   // <---Important!!! In lambda, it will cause double initialization.
        firebase.initializeApp(config);
    }

    const firestore = firebase.firestore();

    //Have list of download urls to return back from function
    let businessFields = [];

    //----------------------------------------------------------------
    //geBusinessFields
    const userRef = firestore.collection('users');

    //From user collection reference
    userRef.get().then(userList => {
        //if empty, display message
        if (userList.empty) {
            console.log('No matching documents.');
            return;
        }

        //Print each document item from user collection and print id and data
        userList.forEach(userDoc => {
            let user = userDoc.data();
            if (user.role === 'business') {
                console.log("userId: ", user.userId, ", name: ", user.business_name);
                businessFields.push(user);
            }
        });
        callback(null, businessFields);
    }).catch(error => {
        callback(error, null);
    });
}