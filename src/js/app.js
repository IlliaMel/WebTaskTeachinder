// Завдання 1. Данні з обєкту random-user-mock привести до вигляду:
import { v4 as uuidv4 } from 'uuid';
import { additionalUsers, randomUserMock } from './FE4U-Lab3-mock.js';

function reformUser(user) {
  const listOfCourses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];
  const listFav = [false, false, false, true];
  return {
    id: uuidv4(),
    favorite: listFav[Math.floor(Math.random() * listFav.length)],
    course: listOfCourses[Math.floor(Math.random() * listOfCourses.length)],
    bg_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    note: null,
    gender: (typeof user.gender === 'string') ? user.gender : null,
    title: (typeof user.name?.title === 'string') ? user.name?.title : (typeof user.title === 'string' ? user.title : null),
    full_name: (typeof user.name?.first === 'string' && typeof user.name?.last === 'string') ? (`${user.name.first} ${user.name.last}`) : (typeof user.full_name === 'string' ? user.full_name : null),
    city: (typeof user.location?.city === 'string') ? user.location?.city : (typeof user.city === 'string' ? user.city : null),
    state: (typeof user.location?.state === 'string') ? user.location?.state : (typeof user.state === 'string' ? user.state : null),
    country: (typeof user.location?.country === 'string') ? user.location?.country : (typeof user.country === 'string' ? user.country : null),
    postcode: (typeof user.location?.postcode === 'number') ? user.location?.postcode : (typeof user.postcode === 'string' ? user.postcode : null),
    coordinates: { latitude: (typeof user.location?.coordinates?.latitude === 'string') ? user.location?.coordinates?.latitude : (typeof user.latitude === 'string' ? user.latitude : null), longitude: (typeof user.location?.coordinates?.longitude === 'string') ? user.location?.coordinates?.longitude : (typeof user.longitude === 'string' ? user.longitude : null) },
    timezone: { offset: (typeof user.location?.timezone?.offset === 'string') ? user.location?.timezone?.offset : (typeof user.offset === 'string' ? user.offset : null), description: (typeof user.location?.timezone?.description === 'string') ? user.location?.timezone?.description : (typeof user.description === 'string' ? user.description : null) },
    email: (typeof user.email === 'string') ? user.email : null,
    b_date: (typeof user.dob?.date === 'string') ? user.dob?.date : (typeof user.date === 'string' ? user.date : null),
    age: (typeof user.dob?.age === 'number') ? user.dob?.age : (typeof user.age === 'number' ? user.age : null),
    phone: (typeof user.phone === 'string') ? user.phone : null,
    picture_large: (typeof user.picture?.large === 'string') ? user.picture?.large : (typeof user.picture_large === 'string' ? user.picture_large : null),
    picture_thumbnail: (typeof user.picture?.thumbnail === 'string') ? user.picture?.thumbnail : (typeof user.picture_thumbnail === 'string' ? user.picture_thumbnail : null),
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

function isStringFildValid(value) {
  return (value.length > 0) && (typeof value === 'string') && (value[0] === value[0].toUpperCase());
}

function isValidUser(user) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email) && /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(user.phone) && (typeof user.age === 'number') && isStringFildValid(user.full_name) && isStringFildValid(user.gender) && isStringFildValid(user.note) && isStringFildValid(user.state) && isStringFildValid(user.city) && isStringFildValid(user.country);
}

// Завдання 3. Написати функцію фільтрації массиву обєктів за параметрами

function filter(usersMain, filterValues) {
  const users = usersMain.map((user) => user);
  return users.filter((user) => Object.keys(filterValues).every((key) => filterValues[key] === user[key]));
}

// Завдання 4. Написати функцію сортування массиву обєктів за параметрами

function sortUsers(usersMain, sortObject) {
  const users = usersMain.map((user) => user);
  if (Object.hasOwn(sortObject, 'full_name')) {
    function compare(user1, user2) {
      if (user1.full_name < user2.full_name) {
        return Number(sortObject.full_name) * (-1);
      }
      if (user1.full_name > user2.full_name) {
        return Number(sortObject.full_name);
      }
      return 0;
    }
    return [users.sort(compare)];
  } if (Object.hasOwn(sortObject, 'b_day')) {
    function compare(user1, user2) {
      if (Date.parse(user1.b_day) < Date.parse(user2.b_day)) {
        return Number(sortObject.b_day) * (-1);
      }
      if (Date.parse(user1.b_day) > Date.parse(user2.b_day)) {
        return Number(sortObject.b_day);
      }
      return 0;
    }
    return [users.sort(compare)];
  } if (Object.hasOwn(sortObject, 'country')) {
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
  } return [];
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
