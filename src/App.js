import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//configuration for the local DB
import * as RxDB from 'rxdb'
import {QueryChangeDetector} from 'rxdb' //optimizes observed queries by getting new results from database events
import {schema} from './Schema'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import * as moment from 'moment';

QueryChangeDetector.enable(); //this is a beta feature so we enable it here
QueryChangeDetector.enableDebugging() //every time an optimization is made, a message in the console is shown

// configure IndexDB as the storage engine, and enable syncing to a remote database over HTTP
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-replication'));
RxDB.plugin(require('pouchdb-adapter-http'));

const syncURL = 'http://localhost:5984/';
const dbName = 'chatdb';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
      messages: []
    }
    this.subs = [] //array to store the handlers of the subscriptions we’re going to use so we can unsubscribe when necessary
    this.addMessage = this.addMessage.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
  }

  async createDatabase(){ //this creates the DB.  Uses the new async/await syntax.
    const db = await RxDB.create(
      {name: dbName, adapter: 'idb', password: '12345678'}
    );
    db.waitForLeadership().then(() => { //This makes sure only 1 tab is managing the data.  The leader tab will have the crown.  This is incase the user has multiple tabs open.
    document.title = '♛ ' + document.title;
  });

  const messagesCollection = await db.collection({ //Now making the schema in the client side DB, aka RxDB.
    name: 'messages',
    schema: schema
  });


  messagesCollection.sync({ remote: syncURL + dbName + '/' }); //this is the replication feature to the server side db.


  const replicationState =
    messagesCollection.sync({ remote: syncURL + dbName + '/' });
  this.subs.push(
    replicationState.change$.subscribe(change => {
      toast('Replication change');
      console.dir(change)
    })
  );
  this.subs.push(
   replicationState.docs$.subscribe(docData => console.dir(docData))
  );
  this.subs.push(
    replicationState.active$.subscribe(active => toast(`Replication active: ${active}`))
  );
  this.subs.push(
    replicationState.complete$.subscribe(completed => toast(`Replication completed: ${completed}`))
  );
  this.subs.push(
    replicationState.error$.subscribe(error => {
      toast('Replication Error');
      console.dir(error)
    })
  );

  return db;
  }

  async componentDidMount() {
    this.db = await this.createDatabase();

    //the $() returns a RxJS obserable.  If any messages are returned a notification is shown and the state is changed
    const sub =
      this.db.messages.find().sort({id: 1}).$.subscribe(messages => {
      if (!messages)
        return;
      toast('Reloading messages');
      this.setState({messages: messages});
    });
    this.subs.push(sub);
    }

  componentWillUnmount() {
  this.subs.forEach(sub => sub.unsubscribe());
  }

  render() {
    return (
      <div className="App">
      <ToastContainer autoClose={3000} />

      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>

      <div>{this.renderMessages()}</div>

      <div id="add-message-div">
        <h3>Add Message</h3>
        <input type="text" placeholder="Message" value={this.state.newMessage}
          onChange={this.handleMessageChange} />
        <button onClick={this.addMessage}>Add message</button>
      </div>
    </div>
    );
  }

  renderMessages(){
    return this.state.messages.map(({id, message}) => {
      const date = moment(id, 'x').fromNow();
      return (
        <div key={id}>
          <p>{date}</p>
          <p>{message}</p>
          <hr/>
        </div>
      );
    });
  }

  handleMessageChange(event) {
  this.setState({newMessage: event.target.value});
  }

  async addMessage() { //this function adds the current state to the database.
  const id = Date.now().toString();
  const newMessage = {id, message: this.state.newMessage};

  await this.db.messages.insert(newMessage);

  this.setState({newMessage: ''});
  }

  async addMessage() {
   const id = Date.now().toString();
   const newMessage = {id, message: this.state.newMessage};

   await this.db.messages.insert(newMessage);

   this.setState({newMessage: ''});
  }
}

export default App;
