const BASE_URL = 'https://629cc2ac3798759975daef0d.mockapi.io'
let page = 1;

let blogs = [];

async function getData() {
    try {
        let response = await fetch(`${BASE_URL}/cw?page=${page}&limit=10`);
        let data = await response.json();
        blogs = data;
        return data;
    } catch (e) {
        console.warn(e)
    }
}

async function deleteData(idArr) {
    let responseArr = []
    try {
        return idArr.forEach(async function (id) {
            let response = await fetch(`${BASE_URL}/cw/${id}`, {
                method: "DELETE",
            });
            responseArr = [...responseArr, await response.json()]
        })
    } catch (e) {
        console.warn(e)
    }
}

async function editData(newObj) {
    try {
        let response = await fetch(`${BASE_URL}/cw/${newObj.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(newObj)
        });
        return await response.json();
    } catch (e) {
        console.warn(e)
    }
}

async function addData(newObj) {
    try {
        let response = await fetch(`${BASE_URL}/cw`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(newObj)
        });
    } catch (e) {
        console.warn(e)
    }
}


async function makeTable() {
    const wrapper = document.getElementById('table-wrapper');
    if (wrapper.childNodes[3]) {
        wrapper.childNodes[3].remove();
    }
    console.log('before table')
    const table = document.createElement('table');
    const tHead = table.createTHead();

    // create head row
    const headings = ['sortable column ↑', 'Status', 'Actions'];
    const headRow = tHead.insertRow();

    const domainCell = headRow.insertCell();
    domainCell.innerHTML = `<input id="all-domains" type="checkbox" onclick="checkAll()"> <label for="all-domains">Domain name</label>`

    headings.forEach((heading) => {
        let cell = headRow.insertCell();
        cell.innerText = heading;
    });

    //create table rows
    const tBody = table.createTBody();
    blogs.forEach((blogObj) => {
        const row = tBody.insertRow();
        const domainCell = row.insertCell()
        domainCell.innerHTML = `<input id=${String(blogObj.id)} class="checkbox" type="checkbox"> <a href="https://${blogObj.domainName}" target="_blank"><label for=${String(blogObj.id)}>${blogObj.domainName}</label></a>`
        Object.values(blogObj).forEach((blogValue, index) => {
            if (index === 2) {
                let cell = row.insertCell();
                blogValue === 'deposit' ? cell.style.color = "orange" : cell.style.color = 'green';
                cell.innerText = blogValue;
            } else if (index === 3) {
                let cell = row.insertCell();
                cell.innerHTML = `<a href="#" class="refresh"><span class="circle-arrow">⥁</span> Refresh</a>`
            } else if (index !== 0) {
                let cell = row.insertCell();
                cell.innerText = blogValue;
            }
        });
    });
    wrapper.append(table)
    console.log('made table')
}


//onclick functions
function checkAll() {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((value) => {
        value.checked = document.getElementById('all-domains').checked;
    })
}

function onDeleteButton() {
    let idArr = [];
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((value) => {
        if (value.checked === true) {
            let id = value.id;
            idArr = [...idArr, id]
        }
    })
    return idArr
}

function onEditButton() {
    const editForm = document.getElementById('edit-form');
    editForm.classList.remove('d-none')
}

function cancelForm() {
    const editForm = document.getElementById('edit-form');
    const inputs = editForm.elements;
    [...inputs].forEach((val) => {
        val.value = '';
    })
    editForm.classList.add('d-none');
}

function confirmForm() {
    const editForm = document.getElementById('edit-form')
    let newObj = {};
    const checkboxes = document.querySelectorAll('.checkbox');
    const checkedCheckbox = [...checkboxes].filter((checkbox) => {
        if (checkbox.checked === true) {
            return checkbox;
        }
    });
    if (checkedCheckbox.length === 1) {
        const editForm = document.getElementById('edit-form');
        const inputs = editForm.elements;
        newObj = {
            domainName: inputs[0].value,
            ip: inputs[1].value,
            status: inputs[2].value,
            id: checkedCheckbox[0].id
        }
    } else {
        alert('You can only edit one row at a time')
        return;
    }
    cancelForm();
    return newObj;
}



getData()
    .then(() => makeTable())