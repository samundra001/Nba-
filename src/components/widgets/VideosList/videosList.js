import React,{Component} from 'react';
import styles from './videosList.module.css';
import {firebaseTeams,firebaseVideos,firebaseLooper} from '../../../firebase'
import Button from '../Buttons/buttons';
import VideosListTemplate from './VideosListTemplate'


class VediosList extends Component {
    state = {
        teams:[],
        videos:[],
        start:this.props.start,
        end:this.props.start + this.props.amount,
        amount:this.props.amount
    }
    renderTitle = () => {
        return this.props.title ? 
        <h3><strong>NBA</strong>&nbsp;Videos</h3>
        :
        null
    }
    

 
   
    componentWillMount(){
        this.request(this.state.start,this.state.end)
    }

    request = (start,end) => {
        if(this.state.teams.length<1){
            firebaseTeams.once('value')
            .then((snapshot)=>{
                const teams = firebaseLooper(snapshot)
                this.setState({
                    teams
                })
            })
        }

        firebaseVideos.orderByChild("id").startAt(start).endAt(end).once('value')
        .then((snapshot)=>{
            const videos = firebaseLooper(snapshot);
            this.setState({
             videos:[...this.state.videos,...videos], // while loadmore we want to keep previous item
                     start,
                      end
            })
        })
        .catch(e => {
            console.log(e)
        })
    }

    renderVideos = () => {
        let template = null;

        switch(this.props.type){
            case('card'):
            template = <VideosListTemplate data = {this.state.videos} teams={this.state.teams} />
            break;
            default:
                template = null
        }
        return template;
    }

    
    loadMore =  () => {
        let end = this.state.end + this.state.amount;
        this.request(this.state.end+1,end)
    }

    renderButton = () => {
        return this.props.loadmore ? 
        <Button 
            type="loadmore"
            loadMore = {()=> this.loadMore()}
            cta= "load More Vedios"/>
        :
        <Button type = "More" cta="More videos" linkto="/videos"/>
    }

    render(){
        
        return (
            <div className={styles.videosList_wrapper}>
               {this.renderTitle()}
               {this.renderVideos()}
               {this.renderButton()}
            </div>
        )
    }

}


export default VediosList;