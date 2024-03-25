function parseCSSVariables(cssString) {
    const variableRegex = /--[\w-]+:[^;]+;/g;
    const variables = cssString.match(variableRegex);

    if (!variables) {
        return {};
    }

    const result = {};

    variables.forEach((variable) => {
        const [name, value] = variable.split(":");
        result[name.trim()] = value.trim();
    });

    return result;
}
function getData(endpoint) {
    return fetch(`http://127.0.0.1:22301${endpoint}`)
        .then((res) => res.text())
        .catch((error) => { });
}

