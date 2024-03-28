import rawJsonData from './theme.json' assert { type: 'json' };
let jsonData = rawJsonData;
function renderThemes() {
    function getData(endpoint) {
        return fetch(`http://127.0.0.1:22301${endpoint}`)
            .then((res) => res.text())
            .catch((error) => { });
    }
    Object.keys(jsonData[jsonData["!selected"]]).forEach(element => {
        if (jsonData[jsonData["!selected"]][element] !== "color-on-accent-light" || jsonData[jsonData["!selected"]][element] !== "color-on-accent-dark") {
            document.documentElement.style.setProperty(`--${element}`, `${jsonData[jsonData["!selected"]][element]}`)
        }
    });
    (async () => {
        let dataObj = await getData("");
        dataObj = JSON.parse(dataObj);
        if (dataObj["theme"]["mode"] == "dark") {
            document.documentElement.style.setProperty(`--color-on-accent`, `${jsonData[jsonData["!selected"]]["color-on-accent-dark"]}`);
        } else {
            document.documentElement.style.setProperty(`--color-on-accent`, `${jsonData[jsonData["!selected"]]["color-on-accent-light"]}`);
        }
    })();
}
renderThemes()