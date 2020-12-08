const url = 'http://localhost:3000/'
let currentUser

document.addEventListener('DOMContentLoaded', () =>  {
    fetchUsers()
    const form = document.querySelector("form")
    const button = document.querySelector("button")
    const postForm = document.querySelector(".create-post-form")
    const editForm = document.querySelector(".edit-post-form")


    postForm.addEventListener('submit', createNewPost)
    button.addEventListener('click', handleSignOut)
    form.addEventListener('submit', handleFormSubmit)
    editForm.addEventListener('submit', handleEditSubmit)

})

function fetchUsers() {
    fetch(url + "users")
    .then(resp => resp.json())
    .then(users => {
        users.forEach(createUser)
    })
}

function fetchPosts() {
    fetch(url + "posts")
    .then(resp => resp.json())
    .then(listPosts)
}

function createUser(user) {
    let card = document.createElement('div')
    card.className = "card"
    // debugger
    card.innerHTML = `
        <div class="content">
            <div class="header">${user.username}</div>
            <div class="meta">${user.email}</div>
        </div>
    `

    document.body.append(card)
    // debugger
}

function listPosts(posts) {
    // console.log(posts)
    let ul = document.querySelector("#posts")
    ul.innerHTML = ""
    posts.forEach(post => {
        // debugger
        let postUl = document.createElement('ul')
        // postUl.innerHTML = post.description
        postUl.innerHTML = `
        <h3>${post.user.username}</h3>
        <h4>${post.user.email}</h4>
        <img src=${post.image_url}>
        <ul>${post.location}</ul>
        <ul>${post.description}</ul>
        `
        const deleteButton = document.createElement('button')
        deleteButton.innerText = "Delete"
        deleteButton.id = `${post.id}`
        deleteButton.addEventListener('click', (e) => {
            // console.log(post)
            handleDelete(e, post)
        })

        postUl.append(deleteButton)
        
        const editButton = document.createElement('button')
        editButton.innerText = "Edit"
        editButton.id = `${post.id}`
        editButton.addEventListener('click', (e) => {
            // console.log(post) 
            populateForm(e, post)
        })
        
        postUl.append(editButton)
        
        
        ul.append(postUl)
        // const editButtons = document.querySelector("#")

    })
    
}


function handleSignOut(e) {
    let form = document.querySelector("form")
    let button = document.querySelector('#signout')

    currentUser = null;
    form.hidden = false;
    button.hidden = true;
}

function handleFormSubmit(e){
    e.preventDefault()
    let username = e.target.querySelector("#username").value
    let email = e.target.querySelector("#email").value
    e.target.reset()

    fetch(url + "users",  {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username, email: email
        })
    }).then(resp => resp.json())
    .then(user => {
        // console.log(user)
        currentUser = user
        createUser(user)
    })
    let form = document.querySelector("form")
    let button = document.querySelector('#signout')
    button.hidden = false;
    form.hidden = true;
    fetchPosts()
 }

function createNewPost(e) {
    e.preventDefault()
    // let postData = {}

    // debugger
    const configObject = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify({
            // username: e.target.username.value,
            username: currentUser.username,

            // email: e.target.email.value,
            email: currentUser.email,

            image_url: e.target.image.value,
            location: e.target.location.value,
            description: e.target.description.value
        })
    }
    fetch(url + "posts", configObject)
    .then(resp => resp.json())
    .then(json => fetchPosts())
}

function handleDelete(e, post) {
    e.preventDefault()
    console.log(post)
    console.log("delete")
    // debugger
    return fetch(url + "posts" + `/${post.id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json()
    .then(json => { 
        return json;
    }))
}

function populateForm(e, post) {
    // console.log(post)
    const editForm = document.querySelector(".edit-post-form")
    const imageForm = document.querySelector("#editImage")
    const locationForm = document.querySelector("#editLocation")
    const descriptionForm = document.querySelector("#editDescription")

    imageForm.value = `${post.image_url}`
    locationForm.value = `${post.location}`
    descriptionForm.value = `${post.description}`
    const hiddenInput = document.createElement('input')

    hiddenInput.type = "hidden"
    hiddenInput.name = "postId"
    hiddenInput.value = `${post.id}`

    editForm.append(hiddenInput)
    
}

function handleEditSubmit(e) {
    e.preventDefault()
    const editForm = document.querySelector(".edit-post-form")
    const image = editForm.editImage.value
    // console.log(e.target)

    const configObject = {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify({
            // username: e.target.username.value,
            image_url: editForm.editImage.value,
            post_id: editForm.postId.value,
            // email: e.target.email.value,
            location: editForm.editLocation.value,

            description: editForm.editDescription.value,
        })
    }
    // debugger
    fetch(url + "posts" + `/${editForm.postId.value}`, configObject)
    .then(resp => resp.json())
    .then(json => fetchPosts())
}