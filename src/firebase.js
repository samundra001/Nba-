import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDYWw_fuv6pIJSctc9Mvxg_8sWjJxZkFlo",
    authDomain: "nba-db-e25cc.firebaseapp.com",
    databaseURL: "https://nba-db-e25cc.firebaseio.com",
    projectId: "nba-db-e25cc",
    storageBucket: "nba-db-e25cc.appspot.com",
    messagingSenderId: "14616106857",
    appId: "1:14616106857:web:24bf09287b2ebc57b74ff8",
    measurementId: "G-6R2P9KN80R"
  };

  firebase.initializeApp(firebaseConfig);


  const firebaseDB=firebase.database();
   const firebaseArticles = firebaseDB.ref('articles');
   const firebaseTeams = firebaseDB.ref('teams');
   const firebaseVideos = firebaseDB.ref('videos');
   
   const firebaseLooper = (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
        data.push({
            ...childSnapshot.val(),
            id:childSnapshot.key
        })
    });
    return data;
   }

   export{ 
       firebase,
       firebaseDB,
       firebaseArticles,
       firebaseVideos,
       firebaseTeams,
       firebaseLooper,
   }