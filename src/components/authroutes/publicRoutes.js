import React from 'react';
import {Route , Redirect} from 'react-router-dom';


const PublicRoutes = ({ // we are geting props from routes.js and destructuring it
    user,
    component:Comp,
    ...rest
}) => {
    return <Route {...rest}  component = {(props)=>(
        rest.restricted ? 
        (user ? 
            <Redirect to = "/dashboard"/>//if logged in dashboard they should enter sign in 
            :
            <Comp {...props} user={user}/> //singn in 
            
            )
        :
        <Comp {...props} user={user}/> // videos ma janxa
    )}/>

   
           
}

export default PublicRoutes;