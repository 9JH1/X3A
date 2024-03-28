import rawJsonData from './theme.json' with { type: 'json' };
let jsonData = Object.keys(rawJsonData);
function renderThemes(themeName){
    console.log(jsonData.length)
}

renderThemes("themename")