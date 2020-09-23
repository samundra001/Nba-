import React,{Component} from 'react';
import {firebase} from '../../../firebase';
import FileUploader from 'react-firebase-file-uploader';

class Uploader extends Component {
    state = {
        name:'',
        isUploading:false,
        progress:0,
        fileURL:''
    }

    handleUploadStart = () => {

        this.setState({isUploading:true,progress:0})

    }

    handleUploadError = (error) => {
        this.setState({isUploading:false})
        console.log(error)
    }
    handleProgress = (progress) => {
        this.setState({
           progress // progress:progress es6 feture 1 sufficient
        })
    }

    handleUploadSuccess = (filename) => {
        
        this.setState({
            name:filename,
            progress:100,
            isUploading:false //success we kill process
        })
        //firebase only gives name we need to grab the link
        firebase.storage().ref('images')
        .child(filename).getDownloadURL()//try to get exact filename and download
        .then(url=>{
            this.setState({fileURL:url})
        })

        this.props.filename(filename) //pass filename to the dashboard to function storefilename backward janxa
    }
    
    render(){
        return (
            <div>
               <FileUploader 
                    accept="image/*" //any type of image
                    name="image"
                    randomizeFilename
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={this.handleUploadStart} //comes from documentation
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
               />
               {this.state.isUploading ? 
              <p>Progress:{this.state.progress}</p>
               : 
               null
               }

               {
                   this.state.fileURL ? 
                   <img  style = {{
                       width:'300px'
                   }} src = {this.state.fileURL} alt={this.state.fileURL}/>
                   :
                   null
               }
            </div>
        )
    }
}
export default Uploader;