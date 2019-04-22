import app from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/functions';
require('firebase/firestore')

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.db = firebase.firestore();
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);
  doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);
  doSignInWithGithub = () =>
    this.auth.signInWithPopup(this.githubProvider);
  doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  doLinkWithGoogle = () =>
    this.auth.currentUser.linkWithPopup(this.googleProvider);
  doLinkWithTwitter = () =>
    this.auth.currentUser.linkWithPopup(this.twitterProvider);
  doLinkWithGithub = () =>
    this.auth.currentUser.linkWithPopup(this.githubProvider);
  doLinkWithFacebook = () =>
    this.auth.currentUser.linkWithPopup(this.facebookProvider);
  doUnlinkFromGoogle = () =>
    this.auth.currentUser.unlink("google.com");
  doUnlinkFromTwitter= () =>
    this.auth.currentUser.unlink("twitter.com");
  doUnlinkFromGithub = () =>
    this.auth.currentUser.unlink("github.com");
  doUnlinkFromFacebook = () =>
    this.auth.currentUser.unlink("facebook.com");

  createUserWithEmailAndPassword = (email, password, name, city, latitude, longitude, validLocation) =>
    this.auth.createUserWithEmailAndPassword(email, password).then(function () {
      app.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.updateProfile({'displayName': name})
          .catch(function(error) {
            console.log(error);
          })
          firebase.firestore().collection('users').doc(user.uid).set({
            EmailAddress: email,
            City: city,
            Name: name,
            ExpectedDateNotifications: true,
            InActivityNotifications: true,
            Latitude: latitude,
            Longitude: longitude,
            ValidLocation: validLocation,
            Created: firebase.firestore.Timestamp.fromDate(new Date()),
            done3Feed: false,
            checkMap: 7,
          }).then(function(){
          }).catch(function(error){
            console.log("Error: "+error);
          });
        }
      });
    });
  deleteAccount = () => app.functions().httpsCallable('deleteUserFromDb')(app.auth().currentUser.uid);
  numbeo = () => app.functions().httpsCallable('numbeo')(app.auth().currentUser.uid);
  
  addJob = (companyName, jobTitle, location, howApplied, applicationStatus, hasInterviewed, optimism, link, enthusiasm, lastContact, expectedContact, latitude, longitude, distance, validLocation) => this.db.collection('users').doc(app.auth().currentUser.uid).collection('jobs').add({
    CompanyName: companyName,
    JobTitle: jobTitle,
    Location: location,
    HowApplied: howApplied,
    ApplicationStatus: applicationStatus,
    HasInterviewed: hasInterviewed,
    Optimism: optimism,
    Link: link,
    Enthusiasm: enthusiasm,
    LastContact: lastContact,
    ExpectedContact: expectedContact,
    Latitude: latitude,
    Longitude: longitude,
    Distance: distance,
    ValidLocation: validLocation,
    Created: firebase.firestore.Timestamp.fromDate(new Date()),
    LastModified: firebase.firestore.Timestamp.fromDate(new Date()),
    Notes: "",
  }).then(function(result){
    return result.id;
  });

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password).then(() => {
    }, (error) => {

      console.log(error);
    });


  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification();

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  sendPasswordResetEmail = (email) =>
    this.auth.sendPasswordResetEmail(email).then(function () {
    });

  fetchSignInMethodsForEmail = (email) => {
    return this.auth.fetchSignInMethodsForEmail(email)
  }

}

export default Firebase;
