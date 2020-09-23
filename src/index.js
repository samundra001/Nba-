import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Routes from './routes';
import {firebase} from './firebase'; 


// <Routes {...props}/>  passing user to all the props after authentication
const App = (props) => {
  return(
    <BrowserRouter>
       <Routes {...props}/> 
    
    
    </BrowserRouter>
  )

}
// user contains all the user in formation
firebase.auth().onAuthStateChanged((user)=>{  // application will start only after authentication
  ReactDOM.render(
  <App user={user}/> , document.getElementById('root'));
})



