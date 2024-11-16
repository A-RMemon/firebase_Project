// console.log(firebase)
let username = document.getElementById('username');
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let checkbox = document.querySelector('#checkbox');
let signupbtn = document.querySelector('#btn');
let googlesingin = document.getElementById('google');
const githublogin = document.getElementById('github');
const imageupload = document.getElementById('imageupload')



signupbtn.addEventListener('click', async function () {
let file = imageupload.files[0]
if(!file){
  alert('please select image')
}else if(!checkbox.checked){
alert('please accept terms and conditions')
}else if(!email.value){
alert('please enter email')
}else if(password.value.length < 6){
alert('your password is to short')
}else{
  var check = false;
  await firebase.database().ref('users').get()
  .then((snap)=>{
    var users =Object.values(snap.val())
    // console.log(users)
    for(let i =0;i<users.length;i++ ){
      // console.log(users[i].email)
      if(users[i].email ==  email.value){
        check = true;
        break

      }
    }
    // console.log(check)
    if(check){
      alert('this email is already registered')
    }else{
// console.log(file)
  const CLOUDNAME = 'dfpqio2ff';
  const UNSIGNEDUPLOAD = 'server';
  const URL = `https://api.cloudinary.com/v1_1/${CLOUDNAME}/upload`;
  const formdata = new FormData();
  formdata.append('upload_preset',UNSIGNEDUPLOAD)
  formdata.append('file',file);
  try{
    fetch(URL,{
      method:"post",
      body:formdata
    })
    .then((resp)=> resp.json())
    .then(async (data)=>{
      console.log(data.secure_url)
      
  await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(async (user) => {
            console.log(user.user.uid)
            let userobject = {
                name: username.value,
                email: email.value,
                password: password.value,
                userId: user.user.uid,
                photo : data.secure_url
            }
            localStorage.setItem("userId",user.user.uid);
            await firebase.database().ref("users").child(user.user.uid).set(userobject)
            alert("account created")
            email.value = "";
            username.value = "";
            password.value = "";

            window.location.href = "main.html"
        })


    })
  }
  catch(e){
    console.log(e.message)

  }
    }
  })
   }
})

googlesingin.addEventListener('click',async function () {
    console.log('hello')
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt : 'select_account'
      });
    await firebase.auth().signInWithPopup(provider)
  .then(async (result) => {
    var credential = result.credential;
    var token = credential.accessToken;
    var user = result.user;
    console.log(result)
    console.log(user.email)
    console.log(user.photoURL)
    console.log(user.uid)
    var object = {
        email : user.email,
        photo : user.photoURL,
        userId : user.uid,
        name : user.displayName
    }
    localStorage.setItem('userId',user.uid)
    await firebase.database().ref("users").child(user.uid).set(object)
     window.location.href = "main.html";
  }).catch((error) => {
    console.log(error)
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
    
})

githublogin.addEventListener('click', async function () {
  
var provider = new firebase.auth.GithubAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
 // Sign in with a popup
 await firebase.auth().signInWithPopup(provider)
 .then(async function (result) {
   const user = result.user;
   console.log(user);
   console.log("GitHub Token:", token);

   const userObject = {
     email: user.email,
     userId: user.uid
   };

  //  Save user info to Realtime Database
   await firebase.database().ref("users").child(user.uid).set(userObject);

  //  Optionally, store user ID in localStorage
   localStorage.setItem("userId", user.uid);

  //  Redirect to another page after successful login
   window.location.href = "main.html"; // Optional redirect
 })
 .catch((error) => {
   console.error("Error during sign-in:", error);
   alert("Error: " + error.message); // Display the error to the user
 });
});
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("No user is logged in");
    }
  });
    


console.log(firebase)

