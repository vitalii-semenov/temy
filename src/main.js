let getRequest = async function(url) {
    let req = await fetch(`${url}`).then(resp => resp.json());
    return req;
}

function renderUsers() {
    getRequest('http://localhost:3000/users').then(resp => {
        let table = document.createElement('table');
        table.classList.add('col-12');
        let oneCountry,
                oneState,
                oneCity;
        resp.map(elem => {
            getRequest(`http://localhost:3000/countries/${elem.country_id}`)
                .then(resp => {
                    oneCountry = resp.name;
                    getRequest(`http://localhost:3000/states/${elem.state_id}`)
                        .then(resp => {
                            oneState = resp.name;
                            getRequest(`http://localhost:3000/cities/${elem.city_id}`)
                                .then(resp => {
                                    let date = new Date(elem.createdAt);
                                    oneCity = resp.name;
                                    table.innerHTML += `
                                    <tbody class="col-12 wrapper">
                                    <tr><td>Name: </td><td>${elem.name}</td></tr>
                                    <tr><td>Email: </td><td>${elem.email}</td></tr>
                                    <tr><td>Phone_number: </td><td>${elem.phone_number}</td></tr>
                                    <tr><td>Country, State, City: </td><td>
                                    ${oneCountry}, 
                                    ${oneState},
                                    ${oneCity}
                                    </td></tr>
                                    <tr class="mb-4"><td>Creation_date</td><td class="mb-4">${date.toDateString()}</td></tr>
                                    </tbody>
                                    <div class="mb-4"></div>
                                    `;
                                });
                        });
                });
        })
        document.querySelector('.users-field').append(table);
    }).catch(error => console.error(error));
};

let form = {};
let myHeaders = new Headers({
    'Content-Type': 'application/json'
});

function postForm() {
    let isAdressNull = address.value,
        isAboutNull = about_me.value;
    if (address.value === '') {
        isAdressNull = null;
    };
    if (about_me.value === '') {
        isAboutNull = null;
    };
    form = {
        id: "",
        name: user_name.value,
        email: email.value,
        phone_number: phone_number.value,
        address: isAdressNull,
        about_me: isAboutNull,
        country_id: country_id.value,
        state_id: state_id.value,
        city_id: city_id.value,
        createdAt: null
    };
};

document.addEventListener('DOMContentLoaded', () => {
    getRequest('http://localhost:3000/countries').then(resp => {
    resp.map(elem => {
        country_id.innerHTML += `
            <option value="" disabled hidden selected>Choose here</option>
            <option value="${elem.id}" >${elem.name}</option>
        `;
    })
})
    country_id.addEventListener('input', () => {
        getRequest('http://localhost:3000/states').then(resp => {
            resp.map(elem => {
                if (elem.country_id === country_id.value) {
                    state_id.innerHTML += `
                    <option value="" disabled hidden selected>Choose here</option>
                    <option value="${elem.id}">${elem.name}</option>
                    `;
            }
        })
        document.querySelector('.f-state').classList.remove('d-none');
    })
})
    state_id.addEventListener('input', () => {
        getRequest('http://localhost:3000/cities').then(resp => {
            resp.map(elem => {
                if (elem.state_id === state_id.value) {
                    city_id.innerHTML = `
                    <option value="" disabled hidden selected>Choose here</option>
                    <option value="${elem.id}">${elem.name}</option>
                    `;
            } 
        })
        document.querySelector('.f-city').classList.remove('d-none');
    })
})

    renderUsers();

    form_registration.addEventListener('submit', () => {
        postForm();
        fetch('http://localhost:3000/users', {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(form)
        }).then(() => {
            // form_registration.reset()
            renderUsers();
        })
    });

})