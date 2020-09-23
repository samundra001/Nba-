import React, {Component} from 'react';
import './layout.css'

import Header from '../../components/Header/header';
import Footer from '../../components/footer/footer';
class Layout extends Component {
    state = {
        showNav:false  // whenever app runs sidenav remains hidden

    }

    togglesidenav = (action) => {
        this.setState({
            showNav:action
        })
    }
// <Header vitra ko all will be avialable in props in header.js 
    render(){
        return(
            <div> 
               <Header
                 user = {this.props.user}
                 showNav={this.state.showNav}
                   onHideNav = { () => this.togglesidenav(false) }
                   onOpenNav = {()  => this.togglesidenav(true)}

               />
            {this.props.children}
              <Footer/>
            </div>
        )
    }
}

export default Layout;