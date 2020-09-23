import React, {Component} from 'react';
import FormField from '../widgets/FormFields/formfield';
import styles from './dashboard.module.css';
import { Editor } from 'react-draft-wysiwyg';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {firebaseTeams, firebaseArticles,firebase} from '../../firebase';
import Uploader from '../widgets/Fileuploader/fileuploader'


class Dashboard extends Component {
    state = {
        editorState:EditorState.createEmpty(),
       postError:'',
        loading:false,
        formdata:{
           author:{ // it should be exact same to id in formfield below
                element:'input',
                value:'',
                config:{
                    name:'author_input',
                    type:'text',
                    placeholder:'enter your Author'
                },
                validation:{
                    required:true,
                   
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
           title:{ // it should be exact same to id in formfield below
                element:'input',
                value:'',
                config:{
                    name:'title_input',
                    type:'text',
                    placeholder:'enter the title '
                },
                validation:{
                    required:true,
                   
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            body:{ // editor content
                element:'texteditor',
                value:'',
                valid:true
            },
            image :{ // uploading file
                element:'image',
                value:'',
                valid:true
            },
            team:{ // for posting team 
                element:'select',
                value:'',
                config:{
                    name:'teams_input',
                    options:[]
                },
                validation:{
                    required:true,
                   
                },
                valid:false,
                touched:false,
                validationMessage:''
            }
        }
 }

 componentDidMount(){
     this.loadTeams()
 }

 loadTeams = () => {
     firebaseTeams.once('value')
     .then((snapshot)=>{
         let team = [];

         snapshot.forEach((childSnapshot)=>{
             team.push({
                 id:childSnapshot.val().teamId,
                 name:childSnapshot.val().city
             })
         })
         //we need inject it to teams.option
         const newFormdata = {...this.state.formdata};
         const newELement = {...newFormdata['team']}; //all info for only team

         newELement.config.options = team;
         newFormdata['team'] = newELement

         //now we have all info in newFormdata and we have to update
         this.setState({
             formdata: newFormdata
         })
     })
 }
    
//,content='' es6 default value,if pass smt it doesnot remains empty
    updateForm = (element,content='') => { //job is to update state
        const newFormdata = {
            ...this.state.formdata //copy of previous
        }
        const newELement = {
            ...newFormdata[element.id] //newformdataemail //first case

        }
        //assign value for normal inputfirld and editor
        if(content===''){
            newELement.value  = element.event.target.value; //assign the new value user types 
        }else{
            newELement.value =content; //editor dont have event and target
        }
       
        //check vaidatin and unblur
        if(element.blur){
            let validData = this.validate(newELement);
           //for showing msg
           newELement.valid = validData[0];//so it will bw true or false
           newELement.validationMessage = validData[1];
        }
        newELement.touched = element.blur; //element was touched or not
     
        //error is shown by formFIelds


        newFormdata[element.id] = newELement; //previous = new

        this.setState({
            formdata:newFormdata
        })
    }

    validate = (element) => {
        let error = [true,''];

       
        if(element.validation.required){
            const valid = element.value.trim()!=='';
            const message = `${!valid ? 'This Field is requires':''}`;
            error = !valid ? [valid,message] : error
        }
        return error;
    }

    submitForm = (event) => {

        event.preventDefault();//if  <form onSubmit = {this.submitForm()}> it wont work 

        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
               dataToSubmit[key] = this.state.formdata[key].value
        }

        for (let key in this.state.formdata){
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }
        console.log(dataToSubmit)

        if (formIsValid){ // we need to get last id of the articles and +1 and post
            console.log ('submit post')
            this.setState({
                loading:true,
                postError:''
            })
             
            firebaseArticles.orderByChild("id")
            .limitToLast(1).once('value')
            .then (snapshot => {
                let articleId = null;
                snapshot.forEach(childSnapshot=>{
                    articleId = childSnapshot.val().id
                });
                dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP //gets servertime and readable form
                dataToSubmit['id'] =articleId+1;
                dataToSubmit['team']=parseInt(dataToSubmit['team'],10) //change to num

              //pushing the post
              console.log(dataToSubmit)
              firebaseArticles.push(dataToSubmit) // when we post we get the article back
              .then(article=>{
                    this.props.history.push(`/articles/${article.key}`)
              }).catch(e=>{
                  this.setState({
                      postError:e.message
                  })
              })
               
            })
        }
        else
        {
            this.setState({
                postError:'Something went wrong'

            })
        }
    }

    submitButton = () =>
    (
      this.state.loading ? //change loading true // it might takes soe time
      'loading...' 
      :
      <div>
          
          <button  type = "submit">ADD POST</button>
      </div>                       
    )

    showError = () => (  
        this.state.postError !== '' ? 
        <div className = {styles.error}>
            {this.state.postError}
        </div>
        :
        ''
    )
// we need to be able to type so need to update state whilw typing
        onEditorStateChange = (editorState) => {

        // it shoild convert to html from json

        let contentState = editorState.getCurrentContent();//lil better
        let rawState = convertToRaw(contentState);//lil better

        let html = stateToHTML(contentState)
        //grab from html and inject to formdata 
        //enter value to body and update state

            this.updateForm({id:'body'},html) //where to put and passing info

                this.setState({
                    editorState
                })
        }

        //   filename={(filename)=>this.storeFilename(filename)} is called when image upload is success in fileuploader.js 

        storeFilename = (filename) => {
            this.updateForm({id:'image'},filename)
        }
   // <form onSubmit = {this.submitForm}> dont user submitForm()
    render(){
        return(
            <div className = {styles.postContainer}>
                <form onSubmit = {this.submitForm}> 
                <h2>Add post</h2>

                <Uploader
                    filename={(filename)=>this.storeFilename(filename)}
                /> 
              
                <FormField
                    id={'author'}
                    formdata={this.state.formdata.author}
                    change = {(element)=>this.updateForm(element)}
                    />

                <FormField
                    id={'title'}
                    formdata={this.state.formdata.title}
                    change = {(element)=>this.updateForm(element)}
                    />


                    <Editor 
                    editorState = {this.state.editorState}
                    wrapperClassName="myEditor-wrapper"
                    editorClassName="myEditor-editor"
                    onEditorStateChange = {this.onEditorStateChange}// {this.onEditorStateChange} we are calling the function we need to update it other we type nothing
                   />

                    <FormField
                    id={'team'}
                    formdata={this.state.formdata.team}
                    change = {(element)=>this.updateForm(element)}
                    />

                        { this.submitButton()}

                        {this.showError()} 

                </form>
            </div>
        )
    }

}

export default Dashboard;