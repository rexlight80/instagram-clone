import { Button, Input } from '@material-ui/core'
import React ,{useState} from 'react'
import {auth,storage,db} from "../firebase"
import firebase from "firebase"
import "../ImageUpload.css"


function ImageUpload({username}) {

     const [caption, setCaption] = useState("");
     const [image,setImage] = useState(null);
     const [progress,setProgress]=useState(0);

    const handleChange=(e)=>{
         if(e.target.files[0]){
             setImage(e.target.files[0]);
         }
    }

    const handleUpload=()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on("state_changed",
        (snapshot)=>{
            const Progress = Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes)*100
            );

            setProgress(Progress)
        },
        (error)=>{
            console.log(error)
            alert(error.message)
        },
        ()=>{
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url=>{
                db.collection("posts").add({
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    caption:caption,
                    imageUrl:url,
                    username:username
                })
            })
            .catch(err=>console.log(err));
            setProgress(0)
            setCaption("")
            setImage(null)
        }

        )

    }
    return (
        <div className="imageupload">
        <progress className="imageupload__progress" value={progress} max="100"/>
            <Input type="text" value={caption} placeholder="Enter a caption" onChange={event=>setCaption(event.target.value)}/>
            <Input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>        
            </div>
    )
}

export default ImageUpload
