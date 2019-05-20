document.addEventListener('DOMContentLoaded', () => {

    let getRequest = async function(url) {
        let req = await fetch(`${url}`).then(resp => resp.json());
        return req;
    }

    function renderUsers() {
        getRequest('/users').then(resp => {
            let table = document.createElement('table');
            table.classList.add('col-12')
            resp.map(elem => {
                let oneCountry,
                    oneState,
                    oneCity;

                getRequest(`/countries/${elem.country_id}`)
                    .then(resp => {
                        oneCountry = resp.name;
                        getRequest(`/states/${elem.state_id}`)
                            .then(resp => {
                                oneState = resp.name;
                                getRequest(`/cities/${elem.city_id}`)
                                    .then(resp => {
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
                                        <tr class="mb-4"><td>Creation_date</td><td class="mb-4">${elem.createdAt}</td></tr>
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

    renderUsers();

    getRequest('/countries').then(resp => {
        resp.map(elem => {
            country_id.innerHTML += `
                <option selected disabled hidden>Choose here</option>
                <option value="${elem.id}" >${elem.name}</option>
            `;
        })
    })
    country_id.addEventListener('input', () => {
        getRequest('/states').then(resp => {
            resp.map(elem => {
                    if (elem.country_id === country_id.value) {
                    state_id.innerHTML += `
                    <option selected disabled hidden>Choose here</option>
                    <option value="${elem.id}">${elem.name}</option>
                    `;
                }
            })
            document.querySelector('.form-state').style.cssText = "display: block";
        })
    })
    state_id.addEventListener('input', () => {
        getRequest('/cities').then(resp => {
            resp.map(elem => {
                if (elem.state_id === state_id.value) {
                    city_id.innerHTML = `
                    <option selected disabled hidden>Choose here</option>
                    <option value="${elem.id}">${elem.name}</option>
                    `;
                } 
            })
            document.querySelector('.form-city').style.cssText = "display: block";
        })
    })

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

    btn_registr.addEventListener('click', () => {
        postForm();
        fetch('/users', {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(form)
        }).then(() => {
            form_registration.reset()
            renderUsers();
        })
    });

})