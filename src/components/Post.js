import React, { useState,useEffect } from 'react'
import "../Post.css"
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from "firebase"


const Post=({postId,imageUrl,username,caption,avatarUrl,user})=> {
    const [comments,setComments]=useState([])
    const [comment,setComment]=useState("")

    useEffect(() => {
    let unsuscribe;
    if(postId){
       unsuscribe= db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp","desc")
        .onSnapshot((snapshot)=>{
            setComments(snapshot.docs.map((doc)=>doc.data()));
        })
    }
        return () => {

            unsuscribe()
        }
    }, [postId])

      const postComment=(event)=>{
              event.preventDefault()
              db.collection("posts").doc(postId).collection("comments").add({
                  text:comment,
                  username:user.displayName,
                  timestamp:firebase.firestore.FieldValue.serverTimestamp()

              })
              setComment("");
      }

    return (
        <div className="post">
        <div className="post__header">
        <Avatar
        className="post__avatar"
        alt="indranajay"
        src={avatarUrl}
        />
            <h3> {username}</h3>
        </div>
        
            <img className="post__image" alt="" src={imageUrl} />
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
            {comments.map((comment)=>{
              return(  <p key={comment.id}>
                <strong >{comment.username} :</strong>{comment.text}
                </p>)
            })

            }
            </div>
           {user && <form className="post__commentBox">
            <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={e=>setComment(e.target.value)}
            />
            <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
            >Post</button>
            </form>}
        </div>

        
    )
}

export default Post
