
console.log('Hello world!')

const hostaddress = "localhost" // please update this to be your sitename or ip address

document.getElementById("message-1").innerHTML = ": " + navigator.platform + " : " + navigator.appVersion + " : " + navigator.userAgent;
const weatherForm = document.querySelector('form')
if (!weatherForm.addEventListener) {                    // For all major browsers, except IE 8 and earlier
    document.getElementById("message-1").innerHTML = "function: addEventListener missing";
    exit
}

const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

messageOne.textContent = ""
messageTwo.textContent = ""

var listnerlenght = weatherForm.addEventListener.length;
var jsversion = version;

if (listnerlenght === 0 || jsversion < 1.5) {
    document.getElementById("message-1").innerHTML = "please use a newer version of your browser or download firefox";
    exit;
}

weatherForm.addEventListener('submit', (e) => {

    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Searching'
    messageTwo.textContent = ""

    fetch('http://' + hostaddress + ':3000/weather?address=' + location).then((response) => {
        if (response.json) {
            response.json().then((data) => {
                if (data.errorMessage) {
                    messageOne.textContent = data.errorMessage
                } else {
                    messageOne.textContent = "apparentTemperature: " + data.apparentTemperature
                    messageTwo.textContent = "currentTemperture: " + data.currentTemprture
                }
            })
        } else {
            messageOne.textContent = "hmm"

        }
    }).catch(function(error) 
    {
        document.getElementById("message-1").innerHTML = " error: " + error;
    })
})
