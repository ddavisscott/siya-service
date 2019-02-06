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
                let businessField = {
                    about: "",
                    additional_notes: "",
                    business_name: "",
                    color: "",
                    email: "",
                    facebook_url: "",
                    follower_count: "",
                    free_credits: "",
                    instagram_url: "",
                    publication: "",
                    replied_submissions: "",
                    role: "",
                    the_good: "",
                    total_submissions: "",
                    tumblr_url: "",
                    upload_date: "",
                    url: "",
                    userId: "",
                    website: "",
                    worth_knowing: ""
                };

                //Write fields from document directly onto object
                businessField.about = user.about;
                businessField.additional_notes = user.additional_notes;
                businessField.business_name = user.business_name;
                businessField.color = user.color;
                businessField.email = user.email;
                businessField.facebook_url = user.facebook_url;
                businessField.follower_count = user.follower_count;
                businessField.free_credits = user.free_credits;
                businessField.instagram_url = user.instagram_url;
                businessField.publication = user.publication;
                businessField.replied_submissions = user.replied_submissions;
                businessField.role = user.role;
                businessField.the_good = user.the_good;
                businessField.total_submissions = user.total_submissions;
                businessField.tumblr_url = user.tumblr_url;
                businessField.upload_date = user.upload_date;
                businessField.url = user.url;
                businessField.userId = user.userId;
                businessField.website = user.website;
                businessField.worth_knowing = user.worth_knowing;
                //push this object onto array
                businessFields.push(businessField);
            }
        });
        callback(null, businessFields);
    }).catch(error => {
        callback(error, null);
    });
}