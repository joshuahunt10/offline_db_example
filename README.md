# Offline React App
This app was created following a tutorial at https://blog.logrocket.com/building-an-offline-first-app-with-react-and-rxdb-e97a1fa64356?t=7

## What is this App?
This app is a display of the offline capabilities of RxDB in conjuction with CouchDB.

## Features
* Ability to work offline and take in data, store it in a client side DB and then sync to server DB.
* The app runs in multiple tabs and marks the leading tab.
* The apps will sync with each other when both are open
* Database events are signaled by a pop up in the browser

### Node Modules
1. __Concurrently__ - For the ability to run two npm scripts at the same time
2. __moment__ - Used to format dates
3. __pouchdb-server__ - The server side database
4. __pouchdb-adapter-http__ - An adapter for communicating with an external CouchDB database.
5. __pouchdb-adapter-idb__ - An adapter to use IndexedDB in a browser.
6. __pouchdb-replication__ - PouchDB's replication and sync algorithm
7. __rxdb__ - client side database
8. __rxjs__ - This helps RxDB handle data correctly
9. __serve__ - For offline testing.  This will be our HTTP server
10. __react-toastify__ - This shows notifications in the app for database events
