import React from 'react';
import { Switch}  from 'react-router-dom';
import Home from './components/Home/Home';
import Layout from './hoc/Layout/layout';
import NewsArticles from './components/Articles/News/Post/index';
import VideoArticle from './components/Articles/videos/video/index';
import NewsMain from './components/Articles/News/main/newsMain';
import VideosMain from './components/Articles/videos/videosMain';
import SignIn from './components/signin/signin';
import Dashboard from './components/Dashboard/dashboard'
import PrivateRoutes from './components/authroutes/privateRoutes';
import PublicRoutes from './components/authroutes/publicRoutes';
const  Routes = (props) => {
    
    //<Layout user = {props.user}> layout can change information if user if logged in
    // if user is logged in it should not be able to enter the sign in restricted={true}
        return(
            <Layout user = {props.user}> 
                     <Switch>
                <PublicRoutes {...props} restricted={false} path = "/" exact component = {Home}/>
                <PublicRoutes {...props} restricted={false} path = "/news" exact component = {NewsMain}/>
                <PublicRoutes {...props} restricted={false} path = "/articles/:id" exact component = {NewsArticles}/>
                <PublicRoutes {...props} restricted={false} path = "/videos/:id" exact component ={VideoArticle}/>
                <PublicRoutes {...props} restricted={false} path = "/videos" exact component = {VideosMain}/>
                <PublicRoutes {...props} restricted={true} path = "/sign-in" exact component = {SignIn}/>
                < PrivateRoutes {...props} path= "/dashboard" exact component = {Dashboard}/>
               
                 </Switch>
            </Layout>
          
        )
    }


export default Routes;
