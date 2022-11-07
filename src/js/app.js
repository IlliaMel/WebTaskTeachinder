// Завдання 1. Данні з обєкту random-user-mock привести до вигляду:
import { v4 as uuidv4 } from 'uuid';
import { additionalUsers, randomUserMock } from './FE4U-Lab3-mock.js';

function reformUser(user) {
  const listOfCourses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];
  const listFav = [false, false, false, true];
  return {
    id: user.id || uuidv4(),
    favorite: user.favorite || listFav[Math.floor(Math.random() * listFav.length)],
    course: user.course || listOfCourses[Math.floor(Math.random() * listOfCourses.length)],
    bg_color: user.bg_color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    note: user.note || null,
    gender: user.gender || null,
    title: user.name?.title || user.title || null,
    full_name: `${user?.name?.first} ${user?.name?.last}` || user.full_name || null,
    city: user.location?.city || user.city || null,
    state: user.location?.state || user.state || null,
    country: user.location?.country || user.country || null,
    postcode: user.location?.postcode || user.postcode || null,
    coordinates: { latitude: user.location?.coordinates?.latitude || user.latitude || null, longitude: user.location?.coordinates?.longitude ||  user.longitude || null },
    timezone: { offset: user.location?.timezone?.offset || user.offset || null, description: user.location?.timezone?.description || user.description || null },
    email: user.email || null,
    b_date:  user.dob?.date || user.date || null,
    age: user.dob?.age || user.age || null,
    phone: user.phone || null,
    picture_large: user.picture?.large ||  user.picture_large || null,
    picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || null,
  };
}


function reformUsers(users) {
  return users.map((user) => reformUser(user));
}

function crossingUsers() {
  const randomUsersArr = reformUsers(randomUserMock);
  const additionalUsersArr = reformUsers(additionalUsers);
  return randomUsersArr.concat(additionalUsersArr);
}

// Завдання 2. Провалідувати обєкт. Тобто перевірити, чи відповідають поля

function isStringFieldValid(value) {
  if (value === null)
    return ""
  return (value.length > 0) && (typeof value === 'string') && (value[0] === value[0].toUpperCase());
}

function isValidUser(user) {
  let emailTestReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let phoneTestReg = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
  return emailTestReg.test(user.email) &&
      phoneTestReg.test(user.phone) &&
      (typeof user.age === 'number') &&
      isStringFieldValid(user.full_name) &&
      isStringFieldValid(user.gender) &&
      isStringFieldValid(user.note) &&
      isStringFieldValid(user.state) &&
      isStringFieldValid(user.city) &&
      isStringFieldValid(user.country);
}

// Завдання 3. Написати функцію фільтрації массиву обєктів за параметрами

function filter(usersMain, filterValues) {
  const users = usersMain.map((user) => user);
  return users.filter((user) => Object.keys(filterValues).every((key) => filterValues[key] === user[key]));
}

// Завдання 4. Написати функцію сортування массиву обєктів за параметрами

//sortObject -> {full_name | b_day | country : 1 | 0 } 1 from greater to lower 0 from lower to greater

function sortUsers(users, sortObject) {
  if (Object.hasOwn(sortObject, 'full_name')) {
    return sortByNames(users, sortObject);
  } if (Object.hasOwn(sortObject, 'b_day')) {
    return sortByDate(users, sortObject);
  } if (Object.hasOwn(sortObject, 'country')) {
    return sortByCountry(users, sortObject);
  } return [];
}

function sortByNames(users,sortObject){
  function compare(user1, user2) {
    if (user1.full_name < user2.full_name) {
      return Number(sortObject.full_name) * (-1);
    }
    if (user1.full_name > user2.full_name) {
      return Number(sortObject.full_name);
    }
    return 0;
  }
  return users.sort(compare);
}

function sortByDate(users,sortObject){
  function compare(user1, user2) {
    if (Date.parse(user1.b_day) < Date.parse(user2.b_day)) {
      return Number(sortObject.b_day) * (-1);
    }
    if (Date.parse(user1.b_day) > Date.parse(user2.b_day)) {
      return Number(sortObject.b_day);
    }
    return 0;
  }
  return users.sort(compare);
}

function sortByCountry(users,sortObject){
  function compare(user1, user2) {
    if (user1.country < user2.country) {
      return Number(sortObject.country) * (-1);
    }
    if (user1.country > user2.country) {
      return Number(sortObject.country);
    }
    return 0;
  }
  return users.sort(compare);
}

// Завдання 5. Знайти в массиві об’єкт, який відповідає параметру пошуку

function findUser(users, filterValues) {
  const findUserResult = users.find((user) => Object.keys(filterValues).every((key) => filterValues[key] === user[key]));
  return (typeof findUserResult !== 'undefined') ? findUserResult : {};
}

// Завдання 6. Написати функцію, яка повертає відсоток від загального числа обєктів

function valueOfFoundUsers(users, filterValues) {
  return Math.round(10000 * ((filter(users, filterValues)).length / users.length)) / 100;
}

console.log(crossingUsers());
