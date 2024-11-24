    var maincontent = document.getElementById("maincontent")
var input = document.getElementById("input")
var addbtn = document.getElementById("addbtn")
var deletebtn = document.getElementById("deletebtn")
var updatebtn = document.getElementById("updatebtn")
// var changetheme = document.getElementById("changetheme")
var selectedItem = "";
let userID = localStorage.getItem('userId')
let username = document.querySelector('#name');
let email = document.querySelector('#email')
let logoutbtn = document.getElementById('logoutbtn')
let loading = document.getElementById('loading')
let datashow = document.getElementById('datashow')
let image = document.getElementById('image')

var checkbox = document.getElementById("checkbox")
var checkBoxSelected = false;

logoutbtn.addEventListener('click', async function () {
    try {
        await firebase.auth().signOut()
        // console.log('user signed out')
        localStorage.clear();
        window.location.replace('index.html')

    } catch (error) {
        // console.log(error.message)
    }
});

//add 
addbtn.addEventListener("click", function () {
    if (input.value) {
        var li = document.createElement("li")

        var checkBox = document.createElement("input")
        checkBox.type = "checkbox"
        checkBox.style.margin = "10px"

        var b = document.createElement("b")
        b.innerText = input.value
        b.style.display = "inline-block"
        b.style.margin = "10px"
        b.style.width = "400px"
        b.style.overflow = "hidden"
        var key = firebase.database().ref('todos').push().key



        var editbtn = document.createElement("button")

        var editicon = document.createElement("i")
        editicon.classList.add("fa-pen")
        editicon.classList.add("fa-solid")

        editbtn.appendChild(editicon)
        editbtn.setAttribute('id', key)
        editbtn.setAttribute("onclick", 'edittext(this)')


        var deletebtn = document.createElement("button")
        var deleteicon = document.createElement("i")
        deleteicon.classList.add("fa-trash-can")
        deleteicon.classList.add("fa-solid")
        deletebtn.appendChild(deleteicon)
        deletebtn.setAttribute('id', key)
        deletebtn.setAttribute("onclick", 'deletetext(this)')



        li.appendChild(checkBox)
        li.appendChild(b)
        li.appendChild(editbtn)
        li.appendChild(deletebtn)
        maincontent.appendChild(li)
        input.focus()

        addfirebaseItem(input.value, key)


    }
})
async function addfirebaseItem(val, key) {
    var object = {
        todo: val,
        todo_key: key
    }
    await firebase.database().ref('todos').child(userID).child(key).set(object)
    input.value = "";
    // setItem()
}
async function deletetext(e) {
    // console.log(e.parentNode)
    e.parentNode.remove()
    await firebase.database().ref("todos").child(userID).child(e.id).remove()

    // setItem()
    // 
}
//edit 
function edittext(e) {

    input.value = e.parentNode.childNodes[1].innerText
    addbtn.style.display = "none"
    deletebtn.style.display = "none"
    updatebtn.style.display = "inline"
    input.focus()
    selectedItem = e.parentNode.childNodes[1]
    // console.log(selectedItem)

    // var inputfield  = document.createElement("input")
    // e.parentNode.childNodes[1].remove()
    // e.parentNode.childNodes[1].appendChild(inputfield)



}
//update
updatebtn.addEventListener("click", async function () {
    if (input.value) {
        let key = selectedItem.parentNode.children[2].id
        selectedItem.innerText = input.value
        addbtn.style.display = "inline"
        deletebtn.style.display = "inline"
        updatebtn.style.display = "none"
        await firebase.database().ref('todos').child(userID).child(key).update({
            todo :  input.value
        })
    }
    input.value = ""

})

//checkbopx
checkbox.addEventListener("click", function () {
    for (var item of maincontent.children) {
        console.log(item.children[0].checked)
        item.children[0].checked = !checkBoxSelected

    }
    checkBoxSelected = !checkBoxSelected
})


deletebtn.addEventListener("click", function () {
    for (var i = 0; i < maincontent.children.length; i++) {

        if (maincontent.children[i].children[0].checked) {
            maincontent.children[i].remove()
            i = i - 1

        }

    }
    checkBoxSelected = false;
    checkbox.checked = false;
    // setItem()
})

function SetFirstTime(value) {
    var li = document.createElement("li")

    var checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.style.margin = "10px"

    var b = document.createElement("b")
    b.innerText = value.todo
    b.style.display = "inline-block"
    b.style.margin = "10px"
    b.style.width = "400px"
    b.style.overflow = "hidden"



    var editbtn = document.createElement("button")

    var editicon = document.createElement("i")
    editicon.classList.add("fa-pen")
    editicon.classList.add("fa-solid")


    editbtn.appendChild(editicon)
    editbtn.setAttribute('id', value.todo_key)
    editbtn.setAttribute("onclick", 'edittext(this)')



    var deletebtn = document.createElement("button");
    var deleteicon = document.createElement("i");
    deleteicon.classList.add("fa-trash-can");
    deleteicon.classList.add("fa-solid");
    deletebtn.appendChild(deleteicon);
    deletebtn.setAttribute('id', value.todo_key)
    deletebtn.setAttribute("onclick", 'edittext(this)')
    deletebtn.setAttribute("onclick", 'deletetext(this)');



    li.appendChild(checkBox)
    li.appendChild(b)
    li.appendChild(editbtn)
    li.appendChild(deletebtn)
    maincontent.appendChild(li)

}

async function getItem() {
    // var todo = JSON.parse(localStorage.getItem("TODO")) || []
    // console.log(todo)

    let userID = localStorage.getItem('userId');
    await firebase.database().ref('todos').child(userID).get()
        .then((snap) => {
            const data = snap.val(); // Get the data from Firebase
            if (data) {  // Only proceed if there is data
                console.log(data);
                var values = Object.values(data);  // Convert to array only if data exists
                console.log(values);
                for (var item of values) {
                    SetFirstTime(item);
                }
            }
            //  else {
            //     // console.log("No data available for this user.");
            // }
        })
        .catch((e) => {
            console.log(e);
        });
          loading.style.display = 'none';
            datashow.style.display = 'block'
}

window.onload = function () {
    if (userID) {
        getUserData()
        getItem()


    } else {
        window.location.href = "index.html"
    }
}
async function getUserData() {

    await firebase.database().ref('users').child(userID).get()
        .then((snap) => {
            // console.log(snap.val().email)
            // console.log(snap.val().name)
            // email.innerText = snap.val().email
            username.innerText = snap.val().name
            image.src = snap.val().photo
            image.style.width=150+'px';
            image.style.height=150+'px';
            image.style.borderRadius=100+'%'

          

        })
        .catch((error) => {
            alert(error)
        })
}
