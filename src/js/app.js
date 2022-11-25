import {mock_data} from "../data/mock_data.js";
import {TeacherList} from "./TeacherPackage/teacherList.js";
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';
import { Utils } from  "./Utils/utils.js";

function addTeacherInfoLogic(){
    const addTeacherButtons = document.getElementsByClassName("add-teacher");
    const cancelTeacherAdderButton = document.getElementById("teacher-adder-close");
    const adderDialog = document.getElementById("teacher-adder");

    cancelTeacherAdderButton.addEventListener("click", () => {
        adderDialog.close();
    });

    for (const button of addTeacherButtons) {
        button.addEventListener("click", () => {
            adderDialog.showModal();
        });
    }
}

function searchLogic(data) {

    const searchButton = document.getElementById("find-teacher");
    const cancelSearchButton = document.getElementById("search-result-close");
    const searchDialog = document.getElementById("search-result");


    cancelSearchButton.addEventListener("click", () => {
        searchDialog.close();
    });

    searchButton.addEventListener("click", () => {
        const input = document.getElementById("search-filed");
        searchDialog.showModal();
        TeacherList.setSearchDialog(data,input.value);
        input.value = '';
    });
}

function filterLogic(data){
    const age = document.getElementById("age");
    const region = document.getElementById("region");
    const gender = document.getElementById("sex");
    const onlyPhoto = document.getElementById("only-photo");
    const onlyFavorites = document.getElementById("only-favorites");

    age.onchange = () => {  AllFiltersTogether(data);};

    region.onchange = () => { AllFiltersTogether(data);};

    gender.onchange = () => { AllFiltersTogether(data);};

    onlyPhoto.addEventListener('change', (event) => {
        AllFiltersTogether(data);
    })

    onlyFavorites.addEventListener('change', (event) => {
        AllFiltersTogether(data);
    })

}

function AllFiltersTogether(data){
    const age = document.getElementById("age");
    const region = document.getElementById("region");
    const gender = document.getElementById("sex");
    const onlyPhoto = document.getElementById("only-photo");
    const onlyFavorites = document.getElementById("only-favorites");

    TeacherList.filterData = data.filter((user) =>
        (age.value === 'all' ? true : ageValues(age.value,user.age))
        && (region.value === 'all' ? true : user.country === region.value)
        && (gender.value === 'all' ? true : user.gender === gender.value)
        && (onlyPhoto.checked ? user.picture_large : true)
        && (onlyFavorites.checked ?  user.favorite : true));

    TeacherList.paginationIndex = 0;
    paginationListLogic(TeacherList.filterData);
    onPaginationClick(TeacherList.filterData);
    TeacherList.addAllTeacher(TeacherList.paginationData);
    TeacherList.addForTableInfo(TeacherList.paginationData);
}

function ageValues(value,age){
    if(value === "18-30")
        return age >= 18 && age < 30;
    else if(value === "30-42")
        return age >= 30 && age < 42;
    else if(value === "42-54")
        return age >= 42 && age < 54;
    else if(value === "54-66")
        return age >= 54 && age < 66;
    else if(value === "66-78")
        return age >= 66 && age < 78;
    else
        return false;
}

function buttonsFavLogic(data){
    const rightFavButton = document.getElementById("right-button");
    const leftFavButton = document.getElementById("left-button");

    rightFavButton.addEventListener("click", () => {
        if ((TeacherList.favIndex + 5) < TeacherList.onlyFavTeachers(data).length)
            TeacherList.favIndex++;
        TeacherList.loadFavTeachers(data);
    });

    leftFavButton.addEventListener("click", () => {
        if (TeacherList.favIndex > 0)
            TeacherList.favIndex--;
        TeacherList.loadFavTeachers(data);
    });
}

function paginationListLogic(data){
    let arr = data.slice();
    TeacherList.paginationData = [];
    let paginationIndexStart = TeacherList.paginationIndex * 10;
    let paginationIndexEnd = (arr.length > (paginationIndexStart + 10)) ? paginationIndexStart + 10 : arr.length;
    for (let i = paginationIndexStart; i < paginationIndexEnd; i++){
        TeacherList.paginationData.push(arr[i]);
    }
}
function paginationButtonsCreat(){
    const tableTd = document.getElementById("pagination");
    let html = '';
    html += '<a id="backPag">---</a>';
    html += '<div id="pagNumbers"></div>';
    html += '<a id="forwardPag">---</a>';
    tableTd.innerHTML = html;
}

function paginationButtonsLogic(){
    const backPagButton = document.getElementById("backPag");
    const forwardPagButton = document.getElementById("forwardPag");

    backPagButton.addEventListener("click", () => {
        if (TeacherList.paginationIndex > 0)
            TeacherList.paginationIndex--;
        paginationListLogic(TeacherList.filterData);
        onPaginationClick(TeacherList.filterData);
        TeacherList.addAllTeacher(TeacherList.paginationData);
        TeacherList.addForTableInfo(TeacherList.paginationData);
    });

    forwardPagButton.addEventListener("click", () => {
        if ((TeacherList.filterData.length/10) - 1 > TeacherList.paginationIndex)
            TeacherList.paginationIndex++;
        paginationListLogic(TeacherList.filterData);
        onPaginationClick(TeacherList.filterData);
        TeacherList.addAllTeacher(TeacherList.paginationData);
        TeacherList.addForTableInfo(TeacherList.paginationData);
    });

}

function onPaginationClick(data){
    const div = document.getElementById("pagNumbers");
    let html = '';
    for (let i = 1 ; i < ((data.length/10) + 1); i++){
        if(i === (TeacherList.paginationIndex + 1))
            html += '<a id="selectedPag">' + i + '</a>';
        else
            html += '<span>' + i + '</span>';
    }
    div.innerHTML = html;
}

function tableButtonsLogic(){
    const sortByName = document.getElementById("name-table-info");
    const sortByCourse = document.getElementById("speciality-table-info");
    const sortByAge = document.getElementById("age-table-info");
    const compareByGender = document.getElementById("gender-table-info");
    const sortByCountry = document.getElementById("nationality-table-info");

    sortByName.addEventListener("click", () => {
        TeacherList.sortByName *= -1;
        TeacherList.addForTableInfo(TeacherList.paginationData.sort(compareByNames));
    });

    sortByCourse.addEventListener("click", () => {
        TeacherList.sortByCourse *= -1;

        TeacherList.addForTableInfo(TeacherList.paginationData.sort(compareBySpecialities));
    });

    sortByAge.addEventListener("click", () => {
        TeacherList.sortByAge *= -1;
        TeacherList.addForTableInfo(TeacherList.paginationData.sort(compareByAges));
    });

    compareByGender.addEventListener("click", () => {
        TeacherList.sortByGender *= -1;
        TeacherList.addForTableInfo(TeacherList.paginationData.sort(compareByGenders));
    });

    sortByCountry.addEventListener("click", () => {
        TeacherList.sortByCountry *= -1;
        TeacherList.addForTableInfo(TeacherList.paginationData.sort(compareByCountries));
    });

    function compareByNames(a, b) {
        if (a.full_name < b.full_name) {
            return TeacherList.sortByName * -1;
        }
        if (a.full_name > b.full_name) {
            return TeacherList.sortByName;
        }
        return 0;
    }

    function compareBySpecialities(a, b) {
        if (a.course < b.course) {
            return TeacherList.sortByCourse * -1;
        }
        if (a.course > b.course) {
            return TeacherList.sortByCourse;
        }
        return 0;
    }

    function compareByAges(a, b) {
        if (a.age < b.age) {
            return TeacherList.sortByAge * -1;
        }
        if (a.age > b.age) {
            return TeacherList.sortByAge;
        }
        return 0;
    }

    function compareByGenders(a, b) {
        if (a.gender < b.gender) {
            return TeacherList.sortByGender * -1;
        }
        if (a.gender > b.gender) {
            return TeacherList.sortByGender;
        }
        return 0;
    }

    function compareByCountries(a, b) {
        if (a.country < b.country) {
            return TeacherList.sortByCountry * -1;
        }
        if (a.country > b.country) {
            return TeacherList.sortByCountry;
        }
        return 0;
    }

}

function favAddLogic(data){
    const favoritesButton = document.getElementById("favorites-div-button");
    favoritesButton.addEventListener("click", () => {
        for (let teacher of data){
            if(teacher.id === TeacherList.clickedTeacherId){
                teacher.favorite = !teacher.favorite
                favoritesButton.style.backgroundImage = teacher.favorite ? 'url("../src/images/fav.svg")' : 'url("../src/images/makeFav.svg")' ;
            }
        }
        localStorage.setItem("data" , JSON.stringify(data));
        TeacherList.loadFavTeachers(data);
        AllFiltersTogether(data);
    });
}

function addTeacherResLogic(data){

    //const form = document.getElementById("teacher-add-form");
   // form.onsubmit = function() {
    const add = document.getElementById("submit-appeal-id");
    add.addEventListener("click", () => {
        let name = document.getElementById("teacher-adder-name")?.value;
        let course = document.getElementById("speciality")?.value;
        let country = document.getElementById("country")?.value;
        let city = document.getElementById("teacher-adder-city")?.value;
        let email = document.getElementById("email-id")?.value;
        let phone = document.getElementById("phone-id")?.value;
        let bDate = document.getElementById("b-date-id")?.value;
        let gender = document.querySelector('input[name="sex"]:checked')?.value;
        let bgColor = document.getElementById("bgcolor-id")?.value;
        let note = document.getElementById("textarea-id")?.value;

        let teacher = {
            id: uuidv4(), // user.id ||
            course: course,
            bg_color: bgColor,
            note: note,
            gender: gender,
            title: null,
            full_name: name,
            city: city,
            state: null,
            country: country,
            postcode: null,
            coordinates: {
                latitude: null,
                longitude: null
            },
            timezone: {
                offset: null,
                description: null
            },
            email: email,
            b_date: bDate,
            age: getAge(bDate),
            phone: phone,
            picture_large: null,
            picture_thumbnail: null,
        }


        if(isValidUser(teacher) && isStringFieldValid(bDate) && teacher.age >= 18){
            data.push(teacher);

            AllFiltersTogether(data);
            TeacherList.loadFavTeachers(data);
            const adderDialog = document.getElementById("teacher-adder");


            localStorage.setItem("data" , JSON.stringify(data))

            adderDialog.close();
        }else{
            let emailTestReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            let phoneTestReg = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
            if(!emailTestReg.test(teacher.email)){
                alert('Not valid email');
            }else if (!phoneTestReg.test(teacher.phone)){
                alert('Not valid phone');
            }else if (!isStringFieldValid(teacher.full_name)){
                alert('Not valid full_name');
            }else if (!isStringFieldValid(teacher.gender)){
                alert('Not valid gender');
            }else if (!isStringFieldValid(teacher.note)){
                alert('Not valid note');
            }else if (!isStringFieldValid(teacher.city)){
                alert('Not valid city');
            }else if (!isStringFieldValid(teacher.country)){
                alert('Not valid country');
            }else if (!isStringFieldValid(bDate)){
                alert('Not valid bDate');
            }else if (teacher.age < 18){
                alert('Age must be greater then 18');
            }
            return false;
        }

    });


    function isStringFieldValid(value) {
        if (value === null || value === "" || (typeof value === 'undefined'))
            return false
        return (value.length > 0) && (typeof value === 'string');
    }

    function isValidUser(user) {
        let emailTestReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let phoneTestReg = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
        return emailTestReg.test(user.email) &&
            phoneTestReg.test(user.phone) &&
            isStringFieldValid(user.full_name) &&
            isStringFieldValid(user.gender) &&
            isStringFieldValid(user.note) &&
            isStringFieldValid(user.city) &&
            isStringFieldValid(user.country);
    }

    function getAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


}


function allLogic(mock_data){
    paginationButtonsCreat();

    TeacherList.loadFavTeachers(mock_data);
    AllFiltersTogether(mock_data);
    addTeacherInfoLogic();
    buttonsFavLogic(mock_data);
    filterLogic(mock_data);
    tableButtonsLogic(mock_data);
    searchLogic(mock_data);
    favAddLogic(mock_data);
    addTeacherResLogic(mock_data);
    paginationButtonsLogic();

}


function addStorage() {
    if ("localStorage" in window) {
        fetch("https://randomuser.me/api/?results=50")
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                let arr = data['results'].map(user => Utils.reformUser(user));
                    localStorage.setItem("data" , JSON.stringify(arr))
                TeacherList.allData = JSON.parse(localStorage.getItem("data"));
                allLogic(TeacherList.allData);
            });

    } else {
        alert("no localStorage in window");
    }
}

window.onload = function () {
    if ("localStorage" in window){
        if(localStorage.length === 0){
            addStorage();
        }else{
            TeacherList.allData = JSON.parse(localStorage.getItem("data"));
            allLogic(TeacherList.allData);
        }

    }
};
