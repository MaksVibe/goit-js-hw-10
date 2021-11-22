import { Notify } from "notiflix";
import "./css/styles.css";
import { fetchCountries } from "./js/fetchCountries";
import { debounce } from "lodash";

const refs = {
  input: document.querySelector("#search-box"),
  ul: document.querySelector(".country-list"),
  div: document.querySelector(".country-info"),
};
const DEBOUNCE_DELAY = 300;

const renderList = (countries) => {
  const markup = countries
    .map(
      (country) =>
        `<li><img src="${country.flags.svg}" alt="${country.name.official}" width="40px">${country.name.official}</li>`
    )
    .join("");
  refs.ul.innerHTML = markup;
};

const renderCountry = (countries) => {
  const markup = countries
    .map(
      ({ name, capital, population, flags, languages }) => `<h1><img src="${
        flags.svg
      }" alt="${name.official}" width="40px">${name.official}</h1>
      <ul>
  <li>Capital: <span>${capital}</span></li>
  <li>Population: <span>${population}</span></li>
  <li>Languages: <span>${Object.values(languages)}</span></li>
</ul>`
    )
    .join("");
  refs.div.innerHTML = markup;
};

const searchCountry = () => {
  const searchingCountry = refs.input.value.trim();
  fetchCountries(searchingCountry)
    .then((countries) => {
      if (countries.length > 10) {
        refs.ul.innerHTML = "";
        refs.div.innerHTML = "";
        return Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
      }
      if (countries.length === 1) {
        refs.ul.innerHTML = "";
        renderCountry(countries);
      } else {
        refs.div.innerHTML = "";
        renderList(countries);
      }
    })
    .catch(() => {
      refs.ul.innerHTML = "";
      refs.div.innerHTML = "";
      Notify.failure("Oops, there is no country with that name");
    });
};

refs.input.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));
