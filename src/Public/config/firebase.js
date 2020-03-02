import firebase from 'firebase';

let firebaseConfig = {
  apiKey: 'AIzaSyBl7qReF_cKKJOcFg9tJgJUB25Td0lF0lw',
  authDomain: 'ahem-268917.firebaseapp.com',
  databaseURL: 'https://ahem-268917.firebaseio.com',
  projectId: 'ahem-268917',
  storageBucket: 'ahem-268917.appspot.com',
  messagingSenderId: '339580401727',
  appId: '1:339580401727:web:9c5f958d65c35ef256e08a',
  measurementId: 'G-RBD2PF760X',
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
export {firebaseApp};
