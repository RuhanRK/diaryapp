// DOM ELEMENET
const form = document.querySelector("form"),
  textbox = document.querySelector("#textbox"),
  diaryBox = document.querySelector("#diaryBox"),
  name = document.querySelector("#name"),
  date = document.querySelector("#date"),
  clear = document.querySelector("#clearAll"),
  imgText = document.querySelector("#img");

let state = [];

// set all data to localstorages
const setToLocalStorage = value => {
  let diaries;

  if (localStorage.getItem("diaries") === null) {
    diaries = [];
  } else {
    diaries = JSON.parse(localStorage.getItem("diaries"));
  }
  diaries.unshift(value);

  localStorage.setItem("diaries", JSON.stringify(diaries));
};

// get all data from localstorage
const getDiaries = () => {
  let diaries;

  if (localStorage.getItem("diaries") === null) {
    diaries = [];
  } else {
    diaries = JSON.parse(localStorage.getItem("diaries"));
  }

  //   set all diaries to state
  state = diaries;
  //   call load diary function to show all diaries in webpage
  loadDiary();
};

// generate dynamic ID
const generateID = () => {
  let ID;
  if (state.length === 0) {
    ID = 0;
  } else {
    ID = state[state.length - 1].id + 1;
  }

  return ID;
};

// get all input values from user
const getInputValues = () => {
  let month = new Date().getMonth() + 1;

  const calculateMonth = month < 10 ? `0${month}` : month;
  const defaultDate = `${new Date().getFullYear()}-${calculateMonth}-${new Date().getDate()}`;

  const textValue = textbox.value;
  const nameValue = name.value;
  const imgValue = imgText.value;
  const dateValue = date.value.length > 0 ? date.value : defaultDate;

  return {
    ID: generateID(),
    name: nameValue,
    image: imgValue,
    diary: textValue,
    date: dateValue
  };
};

// clear all input values
const clearInputValues = () => {
  textbox.value = "";
  name.value = "";
  date.value = "";
  imgText.value = "";
};

// generate diaray box
const createDiaryHTML = values => {
  return `<div class="col-12 col-sm-12 col-md-6 col-lg-4 my-3 ">
            <div class="card m-auto shadow-sm p-0 bg-white rounded text-center">
              ${
                values.image
                  ? `<img src="${values.image}" class="card-img-top" alt="${
                      values.name
                    }" />`
                  : ""
              }
              <div class="card-body">
                <p class="card-text">
                  ${values.diary}
                </p>
                
              </div>
              <div class="card-footer p-2">
              <blockquote class="blockquote text-right m-0">
                    <footer class="blockquote-footer text-uppercase">${
                      values.name
                    } <span class="badge badge-secondary">${
    values.date
  }</span></footer>
                </blockquote>
              </div>
            </div>
          </div>`;
};

// add all diary details to web page
const loadDiary = () => {
  state.map(item => {
    let diaryDetails = createDiaryHTML(item);
    diaryBox.insertAdjacentHTML("beforeend", diaryDetails);
  });
};

const addDiaries = () => {
  const inputValues = getInputValues();
  if (!inputValues.name && !inputValues.diary) {
    alert("Write Correct Details");
    return;
  }
  state.unshift(inputValues);
  setToLocalStorage(inputValues);
  loadDiary();
};

// form submit
form.addEventListener("submit", e => {
  e.preventDefault();

  addDiaries();

  console.log(state);
  //   clear input vlaues after submit value
  clearInputValues();
});

// clear all diaries
clear.addEventListener("click", e => {
  state = [];
  localStorage.removeItem("diaries");
  diaryBox.innerHTML = "";
});

// fetch diaries from localstorage after dom loaded
document.addEventListener("DOMContentLoaded", getDiaries);

// Service worker===========
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(registration => {
      console.log("service worker registration successful");
    })
    .catch(err => {
      console.error("service worker registration failed", err);
    });
}
