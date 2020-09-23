import React , {Component} from 'react';
import styles from './signin.module.css';
import FormField from '../widgets/FormFields/formfield';
import {firebase} from '../../firebase'

class SignIn extends Component {
    state = {
        registerError:'',
        loading:false,
        formdata:{
            email:{ // it should be exact same to id in formfield below
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type:'email',
                    placeholder:'enter your email'
                },
                validation:{
                    required:true,
                    email:true
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            password:{
                        element:'input',
                        value:'',
                        config:{
                            name:'password_input',
                            type:'password',
                            placeholder:'enter your password'
                        },
                        validation:{
                            required:true,
                            password:true
                        },
                        valid:false,
                        touched:false,
                        validationMessage:''
            }
        }

    }

    updateForm = (element) => { //job is to update state
        const newFormdata = {
            ...this.state.formdata //copy of previous
        }
        const newELement = {
            ...newFormdata[element.id] //newformdataemail //first case

        }
        newELement.value  = element.event.target.value;
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

        if(element.validation.email){
            const valid = /\S+@\S+\.\S+/.test(element.value);
            const message = `${!valid ? 'Must be valid email':''}`;
            error = !valid ? [valid,message] : error
        }

        
        if(element.validation.password){
            const valid = element.value.length>=5;
            const message = `${!valid ? 'This Field must be greater than5 5':''}`;
            error = !valid ? [valid,message] : error
        }

        if(element.validation.required){
            const valid = element.value.trim()!=='';
            const message = `${!valid ? 'This Field is requires':''}`;
            error = !valid ? [valid,message] : error
        }
        return error;
    }


        submitForm = (event,type) => {
         
            event.preventDefault(); //prevent from submiting the form 
             if(type != null){
                 let dataToSubmit = {};
                 let formIsValid = true;

                 for(let key in this.state.formdata){
                        dataToSubmit[key] = this.state.formdata[key].value
                 }

                 for (let key in this.state.formdata){
                     formIsValid = this.state.formdata[key].valid && formIsValid;
                 }

                 if (formIsValid){
                     // here we need to decide we want to login or register
                  this.setState({
                      loading:true, // we make request to firebase
                      registerError:''
                  })
                  if (type){ //login or register if true log in if false register
                    firebase.auth() //login
                    .signInWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(()=>{
                        this.props.history.push('/')
                    }).catch(error => {
                        this.setState({
                            loading:false,
                            registerError:error.message
                        })
                    })
   
                  }else
                  { firebase.auth() //register
                    .createUserWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(()=>{
                        this.props.history.push('/')
                    }).catch(error => {
                        this.setState({
                            loading:false,
                            registerError:error.message
                        })
                    })
                   
                  }
                 }

            }
          
        }

        //submiting 
        submitButton = () =>
        (
          this.state.loading ? //change loading true // it might takes soe time
          'loading...' 
          :
          <div>
              <button onClick = {(event)=>this.submitForm(event,false)}>Register now</button>
              <button  onClick = {(event)=>this.submitForm(event,true)}>Log In</button>
          </div>                       
        )

       showError = () => (  // if same email is already register
            this.state.registerError !== '' ? 
            <div className = {styles.error}>
                {this.state.registerError}
            </div>
            :
            ''
        )

        render(){
                return (
            <div className={styles.logContainer}>
                <form onSubmit = {(event )=> this.submitForm(event,null)}>
                    <h2>Register / Login In</h2>
                    <FormField
                    id={'email'}
                    formdata={this.state.formdata.email}
                    change = {(element)=>this.updateForm(element)}
                    />
                

                    <FormField
                    id={'password'}
                    formdata={this.state.formdata.password}
                    change = {(element)=>this.updateForm(element)}
                    />

                    { this.submitButton()}

                    {this.showError()} 
                </form>
                

            </div>
         )
    }
}

export default SignIn;