/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const firebase_tools = require('firebase-tools');
const cors = require('cors')({origin: true});
const Busboy = require('busboy');
const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const promisePool = require('es6-promise-pool');
const PromisePool = promisePool.PromisePool;
const secureCompare = require('secure-compare');
var admin = require("firebase-admin");

const {Storage} = require("@google-cloud/storage");
const storage = new Storage({
  projectId: "officium-app",
  keyFilename: "officium-app-firebase-adminsdk.json"
});

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

class Contact {
  constructor(name, email, phoneNumber, address, position, businessCard){
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.position = position;
    this.businessCard = businessCard;
  }
}

class Location {
  constructor(address){
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmail = functions.https.onRequest((req, res) => {

  const mailOptions = {
    from: '"Spammy Corp." <noreply@firebase.com>',
    to: 'noahlouisalderton@gmail.com',
  };

  // Building Email message.
  mailOptions.subject ='Test';
  mailOptions.text = 'Test';

  mailTransport.sendMail(mailOptions)
    .then(console.log('Sent!'))
    .catch((error) => console.error('There was an error while sending the email:', error));
});

exports.sendGoodbyeEmail = functions.auth.user().onDelete((user) => {
  //Checks if email is verified
  //If email not verified, doesn't send
  if (!user.emailVerified) {
    return;
  }

  // Building Email message.
  const email = user.email;
  let messageBody = "Hey " + user.displayName + ",\n\nWe saw that you recently deleted your Officium account.  " +
                    "All your personal information and applications have been deleted from our servers, " +
                    "and this will be the last email you recieve from us.  We hope that your experience " +
                    "was positive.  If you have any comments, please send us an email, so we can make " +
                    "improvements.  If you ever decide to use Officium again, simply create " +
                    "a new account.  Thank you for using Officium!\n\nBest Wishes,\nThe Officium Team"

  const mailOptions = {
    from: '"Officium" <noreply@officium.com>',
    to: email,
    subject: 'We are sorry to see you go...',
    text: messageBody
  };
 
   mailTransport.sendMail(mailOptions)
     .then(console.log('Sent!'))
     .catch((error) => console.error('There was an error while sending the email:', error));
});


admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

//Access to the users collection
var setUser = db.collection('users');


//Creates and store a new user in Firestore
exports.storeUserInDb = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName;
  const uid = user.uid;
  return true;
});

//Stores initial information for the user
exports.addMoreInfo = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  
  setUser.doc(uid).set({
      EmailAddress: data.email,
      Name: data.name,
      City: data.city
    });
  return {uid: uid, email: data.email, name: data.name, city: data.city};
});

//Creates the job and puts it a collection inside a user
exports.createJob = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  
  setUser.doc(uid).collection('jobs').add({
      CompanyName: data.companyName,
      JobTitle: data.jobTitle,
      Location: data.location,
      HowApplied: data.howApplied,
      ApplicationStatus: data.applicationStatus,
      HasInterviewed: data.hasInterviewed,
      Optimism: data.optimism,
      Link: data.link,
      Enthusiasm: data.enthusiasm,
      LastContact: data.lastContact,
      References: data.references
    });
  return {success: "i hope so"};
});

//Deletes user from database
exports.deleteUserFromDb = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  admin.auth().deleteUser(uid);
  
  const path = 'users/' + uid;
  firebase_tools.firestore.delete(path, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: functions.config().fb.token
    });

});

//When a new file is selected, gets its information
exports.onFileChange = functions.storage.object().onMetadataUpdate(event => {
  const object = event.data;
  if(object === undefined){
    return null;
  }
  const bucket = object.bucket;
  const contentType = object.contentType;
  const filePath = object.name;
  console.log("File change detected, function execution started");

  if (object.resourceState === "not_exists") {
    console.log("We deleted a file, exit...");
    return null;
  }

  if (path.basename(filePath).startsWith("resized-")) {
    console.log("We already renamed that file!");
    return null;
  }

  const destBucket = storage.bucket(bucket);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };
  return destBucket
    .file(filePath)
    .download({
      destination: tmpFilePath
    })
    .then(() => {
      return spawn("convert", [tmpFilePath, "-resize", "500x500", tmpFilePath]);
    })
    .then(() => {
      return destBucket.upload(tmpFilePath, {
        destination: "resized-" + path.basename(filePath),
        metadata: metadata
      });
    });
});

//Uploads file to the cloud storage
//TODO make cross-platform
exports.uploadFile = functions.https.onRequest((req, res) => {
  const folderName = req.query.folder;
  console.log(folderName);
  cors(req, res, () => {
    
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method !== 'POST'){
      return res.status(500).json({
        message: 'Not allowed'
      });
    }
    const busboy = new Busboy({headers: req.headers});
    let uploadData = null;
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = {file: filepath, type: mimetype, name: fieldname};
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
      
      const bucket = admin.storage().bucket();
      const dest = path.join(folderName + '/', uploadData.name);
      bucket.upload(uploadData.file, {
        destination: dest,
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: uploadData.type
          }
        }
      }).then(() => {
        return res.status(200).json({
          message: 'It worked!'
        });
      }).catch(err => {
        return res.status(500).json({
          error:err
        });
      });
    });
    busboy.end(req.rawBody);
    return null;
  });
});



// Sends email to users that haven't updates an application in 1 month
// Uses cron-job.org to GET this function everyday at 17:00 ET

//TODO Check if the application is still pending
exports.inactivityNotification = functions.https.onRequest(async (req, res) => {
  const key = req.query.key;
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('The key provided in the request does not match the key set in the environment. Check that', key,
        'matches the cron.key attribute in `firebase env:get`');
    res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.');
    return null;
  }
  let notifUsers = [];
  let reminderApps = [];
  const validUsers = await getValidUsers();

  //Checks if Inactivity Emails are enabled
  let promisePool = new PromisePool(() => inactiveNotifStatus(validUsers, notifUsers), 3);
  await promisePool.start();

  //Check if there has been a month of inactivity 
  promisePool = new PromisePool(() => monthCheck(notifUsers, reminderApps), 3);
  await promisePool.start();

  //Send the Emails
  promisePool = new PromisePool(() => sendInactivityMessage(reminderApps), 3);
  await promisePool.start();
  console.log('Success');
  res.send('Success!');
  return null;
})

function inactiveNotifStatus(users, notifUsers) {
  if (users.length > 0) {
    const user = users.pop();
    return db.collection('users').doc(user.uid).get().then((doc) => {
      if (!doc.exists) {
      return console.log('No such document');
    } else {
      if (doc.data().InActivityNotifications) {
        return notifUsers.push(user);
      }
      return console.log('Email Notifications Disabled');
    }
  })}
  return null;
}

function monthCheck(users, monthDates) {
  if (users.length > 0) {
    const user = users.pop();
    return db.collection('users').doc(user.uid).collection('jobs').get().then((snapshot) => {
      let email = user.email;
      snapshot.forEach((job) => {
        console.log(job.get("ApplicationStatus"));
        if (job.get("ApplicationStatus") !== "Application Submitted")  {
          return null;
        }
        if (job.data().ExpectedContact) {
          const dateObj = new Date();
          dateObj.setDate(dateObj.getDate() - 30);
          let JSDate = dateObj.getFullYear() + "-" + ('0' + (dateObj.getMonth()+1)).slice(-2) + "-" + ('0' + dateObj.getDate()).slice(-2);
          let firebaseDate = (job.data().LastModified.toDate().getYear() + 1900) + "-" + ('0' + (job.data().LastModified.toDate().getMonth()+1)).slice(-2) + "-" + ('0' + job.data().LastModified.toDate().getDate()).slice(-2); 
          console.log("Firebase Date: " + firebaseDate);
          console.log("JS Date: " + JSDate);
          if (JSDate === firebaseDate) {
            const element = new Job(email, job.data().CompanyName);
            console.log(element.email);
            return monthDates.push(element);
          }
          return null;
        }
        return null;
      });
      return null;
    })
    .catch(error => {
      return console.log("Error getting collection:", error);
    });
  }
  else {
    return null;
  }
}

function sendInactivityMessage(users) {
  let user = users.pop();
  if (user !== undefined) {
    console.log(user);
    let email = user.email;
    let jobName = user.job;
    const mailOptions = {
      from: '"Officium" <noreply@officium.com>',
      to: email,
    };

    // Building Email message.
    mailOptions.subject ='Any updates with your ' + jobName +' application?';
    mailOptions.text = "Hello,\n\nYou haven't updated your " + jobName + " application in a while.  " 
                        + "Maybe you should follow up with them.\n\nBest wishes,\nOfficium";

    return mailTransport.sendMail(mailOptions)
      .then(console.log('Sent!'))
      .catch((error) => console.error('There was an error while sending the email:', error));
  }
  return null;
}




// Sends email to users that their job reply by date is today
// Uses cron-job.org to GET this function everyday at 07:00 ET
// https://github.com/firebase/functions-samples/blob/Node-8/delete-unused-accounts-cron/functions/index.js

exports.replyDateNotification = functions.https.onRequest(async (req, res) => {
  const key = req.query.key;
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('The key provided in the request does not match the key set in the environment. Check that', key,
        'matches the cron.key attribute in `firebase env:get`');
    res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.');
    return null;
  }
  let notifUsers = [];
  let todayJobs = [];
  const validUsers = await getValidUsers();

  //Check if Expected Date Notifications are Enabled
  let promisePool = new PromisePool(() => expectedNotifStatus(validUsers, notifUsers), 3);
  await promisePool.start();

  //Check if the expected date matches the today's date
  promisePool = new PromisePool(() => validDate(notifUsers, todayJobs), 3);
  await promisePool.start();

  //Sends the Emails
  promisePool = new PromisePool(() => sendExpectedDateMessage(todayJobs), 3);
  await promisePool.start();
  console.log('Success');
  res.send('Success!');
  return null;
});

async function getValidUsers(users=[], nextPageToken) {
  const result = await admin.auth().listUsers(1000, nextPageToken);

  const validUsers = result.users.filter(user => user.emailVerified);

  users = users.concat(validUsers);

  if (result.pageToken) {
    return getValidUsers(users, result.pageToken);
  }
  return users;
}

function expectedNotifStatus(users, notifUsers) {
  if (users.length > 0) {
    const user = users.pop();
    return db.collection('users').doc(user.uid).get().then((doc) => {
      if (!doc.exists) {
      return console.log('No such document');
    } else {
      if (doc.data().ExpectedDateNotifications) {
        return notifUsers.push(user);
      }
      return console.log('Not set email notif');
    }
  })}
  return null;
}

function validDate(users, todayDates) {
  if (users.length > 0) {
    const user = users.pop();
    return db.collection('users').doc(user.uid).collection('jobs').get().then((snapshot) => {
      let email = user.email;
      snapshot.forEach((job) => {
        if (job.data().ExpectedContact) {
          const dateObj = new Date();
          let date = dateObj.getFullYear() + "-" + ('0' + (dateObj.getMonth()+1)).slice(-2) + "-" + ('0' + dateObj.getDate()).slice(-2);
          console.log("Firebase Date: " + job.data().ExpectedContact.toString());
          console.log("JS Date: " + date);
          if (date === job.data().ExpectedContact.toString()) {
            const element = new Job(email, job.data().CompanyName);
            console.log(element.email);
            return todayDates.push(element);
          }
          return null;
        }
        return null;
      });
      return null;
    })
    .catch(error => {
      return console.log("Error getting collection:", error);
    });
  }
  else {
    return null;
  }
}

//Sends an email to me for testing purposes with the job title
function sendExpectedDateMessage(users) {
  let user = users.pop();
  if (user !== undefined) {
    console.log(user);
    let email = user.email;
    let jobName = user.job;
    const mailOptions = {
      from: '"Officium" <noreply@officium.com>',
      to: email,
    };

    // Building Email message.
    mailOptions.subject ='Your ' + jobName + ' reply-by date is here!';
    mailOptions.text = "Hello,\n\nWe are emailing to notify you that today is the day you are supposed to hear back from " 
                        + jobName + ".  Hopefully you get an offer!\n\nBest wishes,\nOfficium";

    return mailTransport.sendMail(mailOptions)
      .then(console.log('Sent!'))
      .catch((error) => console.error('There was an error while sending the email:', error));
  }
  return null;
}

class Job {
  constructor(email, job) {
    this._email = email;
    this._job = job;
  }
  get email() {
    return this._email;
  }

  get job() {
    return this._job;
  }

  set email(email) {
    this._email = email;
  }

  set job(job) {
    this._job = job;
  }
}
