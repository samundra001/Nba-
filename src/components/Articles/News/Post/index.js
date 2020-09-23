import React , { Component } from 'react';
import {firebase,firebaseDB, firebaseLooper, firebaseTeams } from '../../../../firebase';
import styles from '../../articles.module.css';
import Header from './header'

class NewsArticles extends Component {

    state = {   //two arrays for article and team
        article: [],
        team:[],
        imageURL:''
    }

    componentWillMount(){
        firebaseDB.ref(`articles/${this.props.match.params.id}`).once('value')
        .then ((snapshot)=>{
            let article = snapshot.val();


            firebaseTeams.orderByChild("teamId").equalTo(article.team).once('value')
            .then((snapshot)=>{
                const team = firebaseLooper(snapshot);
                this.setState({
                    article,
                    team
                })
                this.getImageURL(article.image)
            })

        })











        // axios.get(`${URL}/articles?id=${this.props.match.params.id}`) //fetch the imformatio for particular id
        // .then(response => {
        //     let article = response.data[0];
        //         //aticle fetched then go to team array and fetch data of particulaar team id
        //     axios.get(`${URL}/teams?id=${article.team}`) //fetch array from for that particular info
        //     .then (response => {
        //         this.setState({
        //             article,
        //             team:response.data
        //         })
        //     })
        // })
    
    }

    getImageURL = (filename)=> {
        firebase.storage().ref('images')
        .child(filename).getDownloadURL()
        .then (url => {
            this.setState({
                imageURL:url
            })
        })
        }


    render(){
        const article = this.state.article;
        const team = this.state.team;

    
        return (
        <div>
            <div className={styles.articleWrapper}>
                <Header
                    teamData = {team[0]}
                    date={article.date}
                    author={article.author}
                />
            <div className = { styles.articleBody }>
                     <h1>{article.title}</h1>
                     <div className = {styles.articleImages}
                      style={{
                        //   background:`url('/images/articles/${article.img}')`
                          background:`url('${this.state.imageURL}')`
                           }}></div>
                      <div className ={styles.articleText}>
                      {/* dangerouslySetInnerHTML={{
                       __html:article.body (render the html command)
                     }} */}
                       {article.body}
                      </div>

                      </div>
                
            </div>
        </div>
        )
    }
}

export default NewsArticles;