import React from 'react';
import {Link,withRouter} from 'react-router-dom'; // withROuter injects the routes info
import {firebase} from '../../../firebase';//to signout user
import FontAwesome from 'react-fontawesome';
import style from './sideNav.module.css';   


const SideNavItems = (props) => {
console.log(props)
const items = [
    {
        type:style.option,
        icon:'home',
        text:'home',
        link:'/',
        login:''
    },
    {
        type:style.option,
        icon:'file-text-o', 
        text:'News',
        link:'/news',
        login:''
    },
    {
        type:style.option,
        icon:'play', 
        text:'Videos',
        link:'/Videos',
        login:''
    },
    
    {
        type:style.option,
        icon:'sign-in', 
        text:'Dashbord',
        link:'/dashboard',
        login:false// whenever we render we check this 
    },
    {
        type:style.option,
        icon:'sign-in', 
        text:'Sign in',
        link:'/sign-in',
        login:true // whenever we render we check this 
    },
    {
        type:style.option,
        icon:'sign-out', //this will be the item from the from the fontawesome 
        text:'Sign-out',
        link:'/sign-out',
        login:false
    }

]

const element = (item,i) => 
(
    <div key={i} className={item.type}>
    <Link to={item.link}>
        <FontAwesome name={item.icon}/>
           {item.text}
     </Link>
</div>
)
const restricted = (item,i) => { //return special tempalta(sign in and sign out)
    let template = null ;

    if( props.user === null && item.login ) //if user is logout show sign in 
    {
     
        template = element(item,i)
    }


    if(props.user!==null && !item.login){ // if user is loged in we want to show dashbord and signout
            if(item.link === '/sign-out'){
                template = (
                    <div key={i} className={item.type}
                    onClick={()=>{
                            firebase.auth().signOut()
                            .then(()=>{
                                props.history.push("/") // we cant beacuse we dont have history so using withRouter
                            })
                    }}>
                        <FontAwesome name={item.icon}/>
                                 {item.text}
                    </div>
                )
            }else{ // if not singout dashboard
                template = element(item,i)
            }
    }


    return template;
}

const showItems = () =>{
     return items.map( (item,i) => {
         return item.login !== '' ? 
        restricted(item,i)
         :
         element(item,i) // return simpe template no sign in and sign out
     })
        }
       

return (
<div>
    {showItems()}
    
    
</div>
 
)
}

export default withRouter( SideNavItems); //injects all routes info 