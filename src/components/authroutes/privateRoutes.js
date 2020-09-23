import React from 'react';
import {Route , Redirect} from 'react-router-dom';


const PrivateRoutes = ({ // we are geting props from routes.js and destructuring it
    user,
    component:Comp,//Dashboard =Comp contains view we want to render ,we can not use component twice so we rename it
    ...rest //all rest props

}) => {
    return <Route {...rest} component= {(props)=>( // here propose is to check authentication and direct something
        user ? //if user is logged in 
        <Comp {...props} user={user}/> //if athenticated dashbord ma 
        :
        <Redirect to = "/sign-in"/> //not logged in prevent form going dashboard

    )}/>
           
}

export default PrivateRoutes;