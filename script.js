'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
            <img class="country__img" src="${Object.values(data.flags)[0]}" />
            <div class="country__data">
              <h3 class="country__name">${Object.values(data.name)[0]}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${
                (+data.population / 1000000).toFixed(1) + ' million'
              }</p>
              <p class="country__row"><span>🗣️</span>${
                Object.values(data.languages)[0]
              }</p>
              <p class="country__row"><span>💰</span>${
                Object.keys(data.currencies)[0]
              }</p>
            </div>
          </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};
/*
const getCountryAndNeighbour = function (country) {
  //request call 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    //AJAX call 1
    getCountry(data);

    //neighbour
    const [neighbour] = data.borders;
    if (!neighbour) return;

    //request 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      // const curr = Object.keys(currencies);
      // console.log(curr);
      //AJAX call 2
      getCountry(data2, 'neighbour');
    });
  });
};
getCountryAndNeighbour('republic of india');

//CallBack hell


// setTimeout(() => {
//   console.log('1 sec');
//   setTimeout(() => {
//     console.log('2 sec');
//     setTimeout(() => {
//       console.log('3 sec');
//       setTimeout(() => {
//         console.log('4 sec');
//         setTimeout(() => {
//           console.log('5 sec');
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);
*/

// const request = fetch('https://restcountries.com/v3.1/name/sri lanka');

const getJSON = function (url, errorMsg = 'something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};
const getCountryData = function (country) {
  //ist country

  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'country not found')
    .then(data => {
      getCountry(data[0]);

      const neighbour = data[0].borders[0];
      // console.log(neighbour);
      if (!neighbour) throw new Error('No neighbour found');

      //rendering neighbour
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Neighbour not found'
      );
    })

    .then(data => getCountry(data[0], 'neighbour'))
    .catch(err => {
      renderError(
        `Check Internet Connection📶📶📶 ${err.message}.Try again!!!`
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener('click', function () {
  getCountryData('republic of india');
});
// getCountryData('pakistan');

/*
//coding challenge 1

const myCountry = function (lat, long) {
  fetch(
    `https://geocode.xyz/${lat},${long}?geoit=json&auth=1473804969368529288x61798`
  )
    .then(res => {
      if (!res.ok) throw new Error(`Problem occured ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.country}`);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
        .then(res => {
          if (!res.ok) throw new Error(`Fetch Problem occured (${res.status})`);
          return res.json();
        })

        .then(data => getCountry(data[0]))

        .catch(err => console.error(`${err.message}`))
        .finally(() => {
          countriesContainer.style.opacity = 1;
        });
    });
};

navigator.geolocation.getCurrentPosition(data => {
  myCountry(data.coords.latitude, data.coords.longitude);
});
/*

console.log('ist test'); //ist excecuted
setTimeout(() => console.log('0 sec'), 0); //4
Promise.resolve('2nd test').then(res => console.log(res)); //3
Promise.resolve('3rd testt').then(res => {
  for (let i = 0; i < 2000000000; i++) {}
  console.log(res);
});
console.log('3 test'); //2


//creating our own promise
const lottery = new Promise(function (resolve, reject) {
  console.log('Lottery is checking⏳');
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve('You win🤑');
    } else {
      reject('You lost😥');
    }
  }, 5000);
});
lottery.then(res => console.log(res)).catch(err => console.error(err));

//promisifying

const wait = function (sec) {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};
wait(5)
  .then(() => {
    console.log('waited for 5 sec');
    return wait(2);
  })
  .then(() => console.log('waited for 2 more sec'));


navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  err => console.error(err)
);


//coding challenge 2

const wait = function (sec) {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};

const imgContainer = document.querySelector('.images');
const imgCreate = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};
let currentImg;
imgCreate('img/img-2.jpg')
  .then(img => {
    currentImg = img;
    // console.log('1 loaded');
    return wait(3);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return imgCreate('img/img-1.jpg');
  })
  .then(img => {
    currentImg = img;
    // console.log('2 loaded');
    return wait(3);
  })
  .then(() => {
    currentImg.style.opacity = 0;
  })
  .catch(err => alert(err));


const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

//Async await

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: long } = pos.coords;

    //reverse Geocoding

    const revGeo = await fetch(
      `https://geocode.xyz/${lat},${long}?geoit=json&auth=1473804969368529288x61798`
    );
    const dataGeo = await revGeo.json();

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    // console.log(res);
    const data = await res.json();
    // console.log(data);
    getCountry(data[1]);
    countriesContainer.style.opacity = 1;
    return `You are in ${dataGeo.city},${dataGeo.country}`;
  } catch (err) {
    renderError();
    throw err;
  }
};

//IFE
(async function () {
  try {
    const city = await whereAmI();
    console.log(city);
  } catch (err) {
    console.error(`${err}🤢`);
  }
})();
// whereAmI()
//   .then(city => console.log(city))
//   .catch(err => {
//     console.error(`${err}🤢`);
//   });

//the function will return promise in pending state
// const city = whereAmI();
// console.log(city);

*/

//Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/republic of india`),
    getJSON(`https://restcountries.com/v3.1/name/pakistan`),
    getJSON(`https://restcountries.com/v3.1/name/sri lanka`),
  ]);
  console.log(res);
  getCountry(res[0]);
  countriesContainer.style.opacity = 1;
})();
