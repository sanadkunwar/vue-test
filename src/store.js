import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var config = {
  apiKey: "AIzaSyCR-D98yFJvJNN46ySnnuZhJh1z9K3TV7M",
  authDomain: "vue-test-44153.firebaseapp.com",
  databaseURL: "https://vue-test-44153-default-rtdb.firebaseio.com",
  projectId: "vue-test-44153",
  storageBucket: "vue-test-44153.appspot.com",
  messagingSenderId: "972553621573",
};
firebase.initializeApp(config);

// a reference to the Balls collection
const ballsCollection = firebase.firestore()
  .collection('balls');

// the shared state object that any vue component
// can get access to
export const store = {
  ballsInFeed: null,
  currentUser: null,
  writeBall: (message) => {
    const dt = {
      createdOn: new Date(),
      author: store.currentUser.uid,
      author_name: store.currentUser.displayName,
      author_image: store.currentUser.photoURL,
      message
    };
    return ballsCollection.add(dt).catch(e => console.error('error inserting', dt, e));
  }
};
ballsCollection
  .orderBy('createdOn', 'desc')
  .limit(5)
  .onSnapshot((ballsRef) => {
    const balls = [];
    ballsRef.forEach((doc) => {
      const ball = doc.data();
      ball.id = doc.id;
      balls.push(ball);
    });
    console.log('Received Balls feed:', balls);
    store.ballsInFeed = balls;
    
  });

// When a user logs in or out, save that in the store
firebase.auth().onAuthStateChanged((user) => {
  console.log('Logged in as:', user);
  store.currentUser = user;
});