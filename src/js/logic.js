var selectedRow = null
var lastId;
const orderBtn = document.getElementById('add'),
    modalWindow = document.querySelector('.windowModal'),
    submitBtn = document.getElementById('addItem');
var posts = []
let row = document.querySelector('.row');
const pagination_element = document.getElementById('pagination');
var current_page = 1;
var rows = 10;
var sort = false;
var search = {
    query: '',
    start: false
}

document.getElementById("clickSearch").addEventListener('click', () => {
    search.query = document.getElementById("search").value
    search.start = true
})


function Click() {
    sort = true
    document.querySelector(".title").style.border = "2px dashed red"
}

//Modal window for displaying information and buying pizza
window.addEventListener('click', event => {
    if(event.target === modalWindow) {
        modalWindow.classList.add('none');
    }
});

submitBtn.addEventListener('click', () => {
    modalWindow.classList.add('none');
});

orderBtn.addEventListener('click' , () => {
    modalWindow.classList.remove('none');
});


//Personal conclusion
function DisplayList (rows_per_page, page) {
	page--;
	let start = rows_per_page * page;
	let end = start + rows_per_page;
	let paginatedItems;

    if(sort == true){
        paginatedItems = Sort().slice(start, end)
    }
    else if(search.start == true){
        paginatedItems = Search().slice(start,end)
    }
    else{
        paginatedItems = posts.slice(start, end)
    }


	for (let i = 0; i < paginatedItems.length; i++) {
		let item = paginatedItems[i];
		AddBlock(item.id, item.title, item.body);
	}
}

//Creating pages button
function SetupPagination (wrapper, rows_per_page) {
	wrapper.innerHTML = "";
    let items;
    search.start == true ? items = Search() : items = posts
	let page_count = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = PaginationButton(i, items);
		wrapper.appendChild(btn);
	}
}
//Function when clicking on the page
function PaginationButton (page, items) {
	let button = document.createElement('button');
	button.innerText = page;

	if (current_page == page) button.classList.add('active');

	button.addEventListener('click', function () {
		current_page = page;
		DisplayList(rows, current_page);
		let current_btn = document.querySelector('.pagenumbers button.active');
		current_btn.classList.remove('active');
		button.classList.add('active');
        getAllPosts()
	});

	return button;
}

function Sort(){
    return posts.sort((a,b) => a.title.localeCompare(b.title))
}

function Search(){
    return Sort().filter(item => item.title.toLowerCase().includes(search.query.toLowerCase()))
}

function readFormData(){
    var FormData = {};
    FormData["id"] = ++lastId
    FormData["title"] = document.getElementById('title').value
    FormData["body"] = document.getElementById('body').value
    return FormData;
}

function onFormSubmit(){
    let formData = readFormData()
    posts.push(formData)
    clearInfo();
}

function clearInfo(){
    document.getElementById('title').value = ""
    document.getElementById('body').value = ""
}

function onDelete(td, id){
    posts.splice(--id, 1)
    row = td.parentElement.parentElement;
    document.getElementById("post").deleteRow(row.rowIndex);
}


function getAllPosts(){
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(response => {
        while(row.firstChild){
            row.removeChild(row.firstChild)
        }
        if(posts.length <= 99){
            for(let i = 0; i < response.length; i++){
                posts.push(response[i])
                lastId = response[i].id
            }
        }
        DisplayList(rows, current_page);
        SetupPagination(pagination_element, rows);
    })
    .catch(err => {
        console.log(err)
    })
}

function AddBlock(id, title, body){
    var table = document.getElementById("post").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    let cell1 = newRow.insertCell(0);
    cell1.innerHTML = id;
    let cell2 = newRow.insertCell(1);
    cell2.innerHTML = title;
    let cell3 = newRow.insertCell(2);
    cell3.innerHTML = body;
    let cell4 = newRow.insertCell(3);
    cell4.innerHTML =  `<button onclick="onDelete(this,${id})">Delete</button>`;
}

let interval = setInterval(() => {
    if(sort == true){
        getAllPosts()
        clearInterval(interval)
    }
    if(search.start == true){
        getAllPosts()
    }
},10)