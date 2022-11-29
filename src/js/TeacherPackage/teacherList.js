import dayjs from "https://cdn.skypack.dev/dayjs@1.10.7";
import {Utils} from "../Utils/utils.js";


export class TeacherList {


    static sortByAge = 1;
    static sortByCourse = 1;
    static sortByName = 1;
    static sortByCountry = 1;
    static sortByGender = 1;

    static clickedTeacherId;

    static favIndex = 0;
    static paginationIndex = 0;

    static paginationData = [];
    static filterData = [];

    static allData = [];

    static countryChart;
    static courseChart;
    static genderChart;

    static makeTeacherLi(teacher) {
        const li = document.createElement('li');
        li.dataset.id = teacher.id;
        li.className = teacher.favorite ? 'info-teacher fav'  : 'info-teacher';

        const full_name = teacher.full_name.split(' ');
        const name = full_name[0];
        const second_name = full_name[1];

        let liHtml = '';
        liHtml += `<div class="frame">`;
        liHtml += teacher.picture_large ? `<div><img src="${teacher.picture_large}" alt="Teacher Photo"></div>` : `<div><span>${name.charAt(0).toUpperCase()}.${second_name.charAt(0).toUpperCase()}</span></div>`;
        liHtml += `</div>`
        liHtml += `<div class="info-teacher-main-name">${name}<br>${second_name}</div>`;
        liHtml += `<div class="info-teacher-main-spec">${teacher.course}</div>`;
        liHtml += `<div class="info-teacher-main-nationality">${teacher.country}</div>`;

        li.innerHTML = liHtml;

        return li;
    }

    static addAllTeacher(teachers){
        const ul = document.getElementById("all-teachers-list");
        ul.innerHTML = "";
        for (let teacher of teachers){
            ul.appendChild(TeacherList.makeTeacherLi(teacher));
        }
        TeacherList.openInfoLogic(teachers);
    }

    static loadFavTeachers(teachers){
        const ul = document.getElementById("teacher-list-fav-ul");
        ul.innerHTML = "";
        const favTeacher = TeacherList.onlyFavTeachers(teachers);
        const quantity = 5 > favTeacher.length ? favTeacher.length : 5;
        for (let i = TeacherList.favIndex; i < (quantity + TeacherList.favIndex); i++){
            if(i < favTeacher.length)
                ul.appendChild(TeacherList.makeTeacherLi(favTeacher[i]));
        }
        TeacherList.openInfoLogic(teachers);
    }

    static onlyFavTeachers(teachers){
        return teachers.filter(teacher => teacher.favorite);
    }

    static setInfoDialog(li,teachers) {
        let clickedTeacher;
        for (let teacher of teachers){
            if(teacher.id === li.dataset.id){
                clickedTeacher = teacher;
                TeacherList.clickedTeacherId = teacher.id;
                break;
            }
        }
        if(clickedTeacher){
            const section = document.getElementById("upper-info");
            const picture = section.getElementsByTagName('picture');
            picture[0].innerHTML = clickedTeacher.picture_large ? `<div><img src="${clickedTeacher.picture_large}" alt="Teacher Photo"></div>` : `<div><img src="images/no-photo.jpg" alt="Teacher Photo" ></div>` ;

            document.getElementById("teacher-name").getElementsByTagName("span")[0].innerHTML = clickedTeacher.full_name;
            document.getElementById("speciality-teacher-data").getElementsByTagName("span")[0].innerHTML = clickedTeacher.course;


            let date2 = dayjs();
            let date1 = dayjs(date2.year() + clickedTeacher.b_date.slice(4, clickedTeacher.b_date.length));
            const diff = date2.diff(date1,'day',true);

            let days = Math.floor(diff) < 0 ? 365 - Math.floor(diff) : Math.floor(diff);


            document.getElementById("day-to-b-date").getElementsByTagName("span")[0].innerHTML = 'Bday in ' + `${days} days`;

            document.getElementById("location").getElementsByTagName("span")[0].innerHTML = clickedTeacher.city + ',';
            document.getElementById("location").getElementsByTagName("span")[1].innerHTML = clickedTeacher.country;

            document.getElementById("age-sex-data").getElementsByTagName("span")[0].innerHTML = clickedTeacher.age + ',';
            document.getElementById("age-sex-data").getElementsByTagName("span")[1].innerHTML = clickedTeacher.gender;

            document.getElementById("contacts").getElementsByTagName("a")[0].innerHTML = clickedTeacher.email;
            document.getElementById("contacts").getElementsByTagName("span")[0].innerHTML = clickedTeacher.phone;

            document.getElementById("article-map-info").getElementsByTagName("p")[0].innerHTML = clickedTeacher.note;

            document.getElementById("favorites-div-button").style.backgroundImage = clickedTeacher.favorite ? 'url("../src/images/fav.svg")' : 'url("../src/images/makeFav.svg")' ;

            let lat = clickedTeacher.coordinates.latitude;
            let lon = clickedTeacher.coordinates.longitude;


            if(this.map)
                this.map.remove();
            this.map = L.map('map');

            const self = this;

            this.map.on("load",function() { setTimeout(() => {
                self.map.invalidateSize();
            }, 1); });

            this.map.setView([lat ? lat : 0.0, lon ? lon : 0.0], 5);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            L.marker([lat ? lat : 0.0, lon ? lon : 0.0]).addTo(this.map);

            return true;
        }else
            return false;
    }




    static addForTableInfo(data){
        const div = document.getElementsByClassName("table-scroll-container");
        const tbody = div[0].getElementsByTagName('tbody');
        let html = '';
        for (let i = 0; i < data.length; i++){
            html += `<tr>`;
            html += `<td>${data[i].full_name}</td>`;
            html += `<td>${data[i].course}</td>`;
            html += `<td>${data[i].age}</td>`;
            html += `<td>${data[i].gender}</td>`;
            html += `<td>${data[i].country}</td>`;
            html += `</tr>`;
        }
        tbody[0].innerHTML = html;

        const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
        const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;


        var barColors = [
            "#b91d47",
            "#00aba9",
            "#2b9739",
            "#dcba2e",
            "#8cbb2e",
            "#693daf",
            "#0d5d72",
            "#f4ff00",
            "#1e12c5",
            "#2a4219",
            "#cb4689",
            "#6778c0"
        ];





        let countries = _.map(data, function makeMap(user) {
            return user.country;
        });
        let xValuesCountry = [...new Set( countries.map(obj => obj)) ];
        let yValuesCountry = [];

        for (let i of xValuesCountry){
            yValuesCountry.push(0);
        }
        for (let i of data){
            yValuesCountry[xValuesCountry.indexOf(i.country)] += 1;
        }

        if(!TeacherList.countryChart){
            TeacherList.countryChart = new Chart("pie-chart-country", {
                type: "pie",
                data: {
                    labels: xValuesCountry,
                    datasets: [{
                        backgroundColor: barColors,
                        data: yValuesCountry
                    }]
                },
                options: {
                    legend:{
                        display: false
                    },
                    title: {
                        display: true,
                        text: "Countries"
                    }
                }
            });
        }else{

            TeacherList.countryChart.data = {
                labels: xValuesCountry,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValuesCountry
                }]
            };
            TeacherList.countryChart.update();
        }





        let courses = _.map(data, function makeMap(user) {
            return user.course;
        });
        let xValuesSpeciality = [...new Set( courses.map(obj => obj)) ];
        let yValuesSpeciality = [];

        for (let i of xValuesSpeciality){
            yValuesSpeciality.push(0);
        }
        for (let i of data){
            yValuesSpeciality[xValuesSpeciality.indexOf(i.course)] += 1;
        }
        if(!TeacherList.courseChart) {
            TeacherList.courseChart = new Chart("pie-chart-speciality", {
                type: "pie",
                data: {
                    labels: xValuesSpeciality,
                    datasets: [{
                        backgroundColor: barColors,
                        data: yValuesSpeciality
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "Specialities"
                    }
                }
            });
        }else{
            TeacherList.courseChart.data = {
                labels: xValuesSpeciality,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValuesSpeciality
                }]
            };
            TeacherList.courseChart.update();
        }

        let males = data.filter(user => user.gender === "male").length;
        let females = data.filter(user => user.gender === "female").length;
        let xValuesGender = ["Male", "Female"];
        let yValuesGender = [ males, females];
        if(!TeacherList.genderChart) {
            TeacherList.genderChart = new Chart("pie-chart-gender", {
            type: "pie",
            data: {
                labels: xValuesGender,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValuesGender
                }]
            },
            options: {
                legend:{
                    display: false
                },
                title: {
                    display: true,
                    text: "Genders"
                }
            }
        });
    }else{
            TeacherList.genderChart.data = {
                labels: xValuesGender,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValuesGender
                }]
            };
            TeacherList.genderChart.update();

        }
    }

    static setSearchDialog(data,request){
        const ul = document.getElementById("search-result-list");
        const teachersRes = TeacherList.searchTeachers(data,request);
        ul.innerHTML = '';
        for (let i = 0; i < teachersRes.length; i++){
            ul.appendChild(TeacherList.makeTeacherLi(teachersRes[i]));
        }
    }

    static searchTeachers(data,request){
        const regular = new RegExp(request.toLowerCase() + '[a-zA-Z]*')

        return _.filter(data, function(user) {
            return ((typeof (request * 1) === 'number') ? user.age === (request * 1) : false) || regular.test(user.full_name.toLowerCase());
        });
    }

    static openInfoLogic(data){
        const infoTeacherButtons = document.getElementsByClassName("info-teacher");
        const cancelTeacherInfoButton = document.getElementById("info-card-teacher-close");

        const infoDialog = document.getElementById("info-card-teacher");
        for (const button of infoTeacherButtons) {
            button.addEventListener("click", () => {
                infoDialog.removeAttribute('open')
                TeacherList.setInfoDialog(button,data)
                infoDialog.showModal();
            });
        }

            cancelTeacherInfoButton.addEventListener("click", () => {
            infoDialog.close();
        });
    }
}
