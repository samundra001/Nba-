import React , {Component} from 'react';
import {firebaseLooper ,firebaseTeams ,firebaseDB,firebaseVideos} from '../../../../firebase';
import styles from '../../articles.module.css';
import Header from './header';
import VideosRelated  from '../../../widgets/VideosList/videosRelated/videosRelated';

class VideoArticle extends Component {
        state = {
            article:[],
            team:[],
            teams:[],
            related:[]
        }

        componentWillMount(){

            firebaseDB.ref(`videos/${this.props.match.params.id}`).once('value')
            .then ((snapshot)=>{
                let article = snapshot.val();
    
    
                firebaseTeams.orderByChild("teamId").equalTo(article.team).once('value')
                .then((snapshot)=>{
                    const team = firebaseLooper(snapshot);
                    this.setState({
                        article,
                        team
                    })
                    this.getRelated();
                })
    
            })
    



        

        //     axios.get(`${URL}/videos?id=${this.props.match.params.id}`) //fetch the imformatio for particular id
        //     .then(response => {
        //         let article = response.data[0];
        //             //aticle fetched then go to team array and fetch data of particulaar team id
        //         axios.get(`${URL}/teams?id=${article.team}`) //fetch array from for that particular info
        //         .then (response => {
        //             this.setState({
        //                 article,
        //                 team:response.data
        //             });
        //             this.getRelated();
        //         })
        //     })
         }

        getRelated = () => {
            firebaseTeams.once('value')
            .then((snapshot)=>{
                const teams = firebaseLooper(snapshot);

                firebaseVideos.orderByChild("team")
                .equalTo(this.state.article.team)
                .limitToFirst(3)
                .once('value')
                .then((snapshot)=>{
                    const related = firebaseLooper(snapshot);
                    this.setState({
                        teams,
                        related
                    })
                })
            })







            // axios.get(`${URL}/teams`)
            // .then(response => {
            //     let teams = response.data //all the teams data
               
            //     axios.get(`${URL}/videos?q=${this.state.team[0].city}&_limit=3`)
            //     .then(response => {
            //         this.setState({
            //             teams,
            //             related:response.data      // we get the name of city of the given team  from data
            //             // we return 3  team of that city 
            //         })
            //     })
            // })
        }

    render (){
        const article = this.state.article;
        const team = this.state.team;



        return (
            <div>
                 
                    <Header teamData = {team[0]}/>

                    <div className = {styles.videoWrapper}>
                     <h1>{article.title}</h1>
                     <iframe
                     title="videoplayer"
                     width="100%"
                     height="300px"
                     src={`https://www.youtube.com/embed/${article.url}`}>
                          </iframe>
                      </div>


                        <div>
                            <VideosRelated 
                            data = {this.state.related}
                            teams = {this.state.teams}/>
                         </div>

                   
            </div>
        )
    }
}

export default VideoArticle;