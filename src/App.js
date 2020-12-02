import React , {useState,useEffect} from "react"
import './App.css';
import Post from './components/Post';
import {db,auth} from "./firebase"
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = ()=> {
  const classes=useStyles()
  const[posts,setPosts] = useState([]);
 const[open,setOpen] = useState(false);
 const[openSignin,setOpenSignin]=useState(false)
 const[username,setUsername]=useState("")
 const[email,setEmail]=useState("")
 const[password,setPassword]=useState("")
 const [user,setUser]=useState(null)
const modalStyle=getModalStyle()


useEffect(()=>{
  const unsuscribe= auth.onAuthStateChanged(authUser=>{
     if(authUser){
           console.log(authUser)
           setUser(authUser)
       }else{
       setUser(null)
     }
   })

   return ()=>{
     unsuscribe();
   }
},[user,username])


useEffect(()=>{
        db.collection("posts").orderBy('timestamp','desc').onSnapshot(snapshot=>{
          setPosts(snapshot.docs.map(doc=>({
            post:doc.data(),
            id:doc.id
          })));
        })
  },[])


  const signUp=(event)=>{
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password).then(authuser=>{
        return authuser.user.updateProfile({
          displayName:username
        })
      }).catch((err)=>{return alert(err.message)})

      setOpen(false)

  }

  const signin=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .then(()=>setOpenSignin(false))
    .catch(err=>console.log(err))
  }

  return (
    <div className="app">

    <Modal
  open={open}
  onClose={()=> setOpen(false)}>
  <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
    <center>
    
    <img
    className="app__headerImage"
    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    alt=""
    />
    </center>

    <Input
     placeholder="username"
     type="username"
     value={username}
     onChange={e=>setUsername(e.target.value)}
     />
    
     <Input
     placeholder="email"
     type="text"
     value={email}
     onChange={e=>setEmail(e.target.value)}
     />
    
     <Input
     placeholder="password"
     type="password"
     value={password}
     onChange={e=>setPassword(e.target.value)}
     />
     <Button onClick={signUp} type="submit">Sign Up</Button>
   
    </form>
    </div>
    
</Modal>

<Modal
  open={openSignin}
  onClose={()=> setOpenSignin(false)}>
  <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
    <center>
    
    <img
    className="app__headerImage"
    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    alt=""
    />
    </center>

    
    
     <Input
     placeholder="email"
     type="text"
     value={email}
     onChange={e=>setEmail(e.target.value)}
     />
    
     <Input
     placeholder="password"
     type="password"
     value={password}
     onChange={e=>setPassword(e.target.value)}
     />
     <Button onClick={signin} type="submit">Sign In</Button>
   
    </form>
    </div>
    
</Modal>
     <div className="app__header">
     <img
     className="app__headerImage"
     src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
     alt=""
     />
     {user ? (<Button onClick={()=>{auth.signOut()}} type="submit">LogOut</Button>) :
    (<div>
      <Button onClick={()=>setOpenSignin(true)} type="submit">Sign In</Button>
      <Button onClick={()=>setOpen(true)} type="submit">Sign Up</Button>
     </div>)}
     
  </div>

 
  <div className="app__posts">
  <div> 
  {
    posts.map(({id,post})=>{
       return(
        <Post key={id} postId={id} imageUrl={post.imageUrl} username={post.username} caption={post.caption} user={user}/>
        )
      })
    }
    </div>
 
    </div>

    {user?.displayName ? (<ImageUpload username={user.displayName}/>):(<h3>Sorry login to upload</h3>)}

  </div>
  ) }

export default App;
