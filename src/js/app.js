const arr = filter([{ name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John1', age: 30 }, { age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }, { name: 'John', age: 30 }], { name: 'John1' });

arr.forEach((element) => console.log(element));

const usersList = [{
  full_name: 'A', age: 30, b_day: '02 Feb 1996 03:04:05 GMT', country: 'Uk',
}, {
  full_name: 'B', age: 30, b_day: '02 Feb 1992 03:04:05 GMT', country: 'zk',
}, {
  full_name: 'C', age: 30, b_day: '02 Feb 1997 03:04:05 GMT', country: 'Um',
}, {
  full_name: 'A', age: 30, b_day: '02 Feb 1998 03:04:05 GMT', country: 'Ua',
}];

function isStringFildValid(value) {
  return (value.length > 0) && (typeof value === 'string') && (value[0] === value[0].toUpperCase());
}

// Завдання 2. Провалідувати обєкт. Тобто перевірити, чи відповідають поля

function isValidUser(user) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email) && /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(user.phone) && (typeof user.age === 'number') && isStringFildValid(user.full_name) && isStringFildValid(user.gender) && isStringFildValid(user.note) && isStringFildValid(user.state) && isStringFildValid(user.city) && isStringFildValid(user.country);
}

// Завдання 3. Написати функцію фільтрації массиву обєктів за параметрами

function filter(users, filterValues) {
  return users.filter((user) => Object.keys(filterValues).every((key) => filterValues[key] === user[key]));
}

// Завдання 4. Написати функцію сортування массиву обєктів за параметрами

function sortUsers(users, sortObject) {
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
    return [users.sort(compare)];
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

console.log(sortUsers(usersList, { country: '1' }));
// console.log(findUser(usersList, { name: 'Alan', age: 30 }));
