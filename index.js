// console.log(firebase)
let username = document.getElementById('username');
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let checkbox = document.querySelector('#checkbox');
let signupbtn = document.querySelector('#btn');
let googlesingin = document.getElementById('google')



signupbtn.addEventListener('click', async function () {
    await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(async (user) => {
            console.log(user.user.uid)
            let userobject = {
                name: username.value,
                email: email.value,
                password: password.value,
                userId: user.user.uid
            }
            localStorage.setItem("userId",user.user.uid);
            await firebase.database().ref("users").child(user.user.uid).set(userobject)
            alert("account created")
            email.value = "";
            username.value = "";
            password.value = "";

            window.location.href = "main.html"

        })
        .catch((e) => {
            alert(e.message)
        })


})

googlesingin.addEventListener('click',function () {
    console.log('hello')
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt : 'select_account'
      });
     firebase.auth().signInWithPopup(provider)
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
console.log(firebase)
