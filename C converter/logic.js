//Base API URL for fetching currency exchange rates
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

//Select all dropdowns(From & To)
const dropdowns = document.querySelectorAll(".dropdown select");
//Select button
const btn = document.querySelector("form button");
//Select From currency dropdown
const fromCurrency = document.querySelector(".from select");
//Select To currency dropdown 
const toCurrency = document.querySelector(".to select");
//Select message area where result will be shown
const msg = document.querySelector(".msg");

//Populate dropdowns with currency codes
for(let select of dropdowns){
    //Loop through countryList object(currency --> countrycode)
    for(currencycode in countryList){
        //console.log(currencycode, countryList[currencycode]);  //for print on console country code and currency

        //Create a new <option> element
        let newOption = document.createElement("option");
        //Set visible text in dropdown(like USD, INR)
        newOption.innerText = currencycode
        //Set value of option
        newOption.value = currencycode;

        //Set default selected values
        if(select.name === "from" && currencycode === "USD"){
            newOption.selected = "selected" // default From = USD
        }
        else if(select.name === "to" && currencycode === "INR"){
            newOption.selected = "selected" // default To = INR
        }

        //Add option to dropdown
        select.append(newOption);
    }

    //When dropdown value changes -> update flag
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}

//Function to fetch exchange rate and update UI
const updateExcangeRate = async () => {
    //Get input field(amount)
    let amount = document.querySelector(".amount input");
    //Get value entered by user
    let amtVal = amount.value;
    console.log(amtVal);
    //If input is empty or less than 1 -> set default = 1
    if(amtVal === "" || amtVal < 1){
        amtVal = 1;
        amount.value = "1";
    }

    //console.log(fromCurrency.value, toCurrency.value);

    //Create API URL(eg: /usd.json)
    //Make API URL using selected "from" currency
    //eg: USD -> usd.json
    //This URL gives all exchange rates for that currency
    const URL = `${BASE_URL}/${fromCurrency.value.toLowerCase()}.json`;
    //Fetch data from API
    let response = await fetch(URL);
    //Convert response into JSON
    let data = await response.json();
    //Get exchange rate from API response
    //eg: data["usd"]["inr"]
    let rate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];
    console.log(rate);
    console.log(amount);

    //Calculate final converted amount
    let finalAmount = amtVal * rate;
    //Show result on screen
    msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`
}

//Function to update flag image
const updateFlag = (element) => {
    console.log(element)  //change  using element and not use that line in this function

    //Get selected currency code(like USD, INR)
    let currencycode = element.value;
    console.log(currencycode)

    //Get country code using countryList(like US, IN)
    let countryCode = countryList[currencycode]; //IN, EU ...
    //Create flag image URL
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    //Find image inside same container
    let img = element.parentElement.querySelector("img");
    //Update image source
    img.src = newSrc;
}

//Button click event
btn.addEventListener("click", (evt) => {
    //Prevent page reload
    evt.preventDefault();
    //Call function to update exchange rate
    updateExcangeRate();
})

//Run when page loads
window.addEventListener("load", () => {
    //Automatically show exchange rate on load
    updateExcangeRate();
})

