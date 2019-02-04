var firebase = require('firebase'); 
 
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;  //<---Important
    
    /* Place Firebase configuration information (Currently found under Firebase project > Authentication > Web Setup (upper right corner))*/
      if(firebase.apps.length == 0) {   // <---Important!!! In lambda, it will cause double initialization.
        firebase.initializeApp(config);
    }

    const firestore = firebase.firestore();
    //const settings = {/* your settings... */ timestampsInSnapshots: true};
    //firestore.settings(settings);


    //Reading from single firestore document
    const userRef = firestore.collection('users').doc('Eve');
    userRef.get().then(function(userSnap) {
        let user = userSnap.data();
        callback(null, user.name);
    }).catch(function(error) {
        callback(error, null);
    })

    //----------------------------------------------------------------
    //For both firestore read/write functions (syaTestRead_fs/syaTestWrite_fs)
    const userRef = firestore.collection('users');

    //syaTestRead_fs
    //From user collection reference
    userRef.get().then(userSnap => {
        //if empty, display message
        if (userSnap.empty) {
            console.log('No matching documents.');
            return;
        }

        //Print each document item from user collection and print id and data
        userSnap.forEach(userDoc => {
            console.log(userDoc.id, '=>', userDoc.data());
        });
        context.succeed("Read: items!");
    }).catch(error => {
        callback(error, null);
    });

    //----------------------------------------------------------------
    //syaTestWrite_fs
    var userInfo = {
        //name: 'Rivest'
        name: event.name
    };

    /*//Creates new document in user collection under 'Rivest' document id
    const newDoc = userRef.doc('Rivest').set(userInfo);*/
    
    //Creates new doc with auto-generated ID (and name data determined by query)
    const newerDoc = userRef.add(userInfo).then(doc => {
        console.log('Added document with ID: ', doc.id);
        context.succeed("Added a doc!");
    }).catch(error => {
        callback(error, null);
    });

    //----------------------------------------------------------------
    //syaTestRead
    firebase.database().ref()
    .on("value", function(snapshot) {
        console.log(snapshot.val());
        callback(null, snapshot.val());
    }, function (error) {
        console.log('Firebase error: ', error);
        context.fail();
        callback(error, null);
    });
    
    //----------------------------------------------------------------
    //syaTestWrite
    firebase.database().ref(event.ref).child(event.key)
    .set(event.value)
    .then(function (data) {
        console.log('Firebase data: ', data);
        context.succeed("Wrote: item!");
    })
    .catch(function (error) {
        console.log('Firebase error: ', error);
        context.fail();
    })
}