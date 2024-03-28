document.getElementById("export").addEventListener("click", () => {
    const sendRestartCommand = () => {
        if (window.require) {
            const electron = window.require('electron');
            electron.ipcRenderer.send('restart'); // Send the "restart" command to main.js
        } else {
            document.body.innerHTML = "require commands only work in a compiled app and not in localhost :("
        }
    };
    sendRestartCommand();
})

function getData(endpoint) {
    return fetch(`http://127.0.0.1:22301${endpoint}`)
        .then((res) => res.text())
        .catch((error) => { });
}


(async () => {
    let dataObj = await getData("");
    dataObj = JSON.parse(dataObj);
    document.getElementById("username").innerText = dataObj["computer"]["username"];
    document.documentElement.style.setProperty("--accent", dataObj["theme"]["raw"])
})();

function runFileView() {
    document.getElementById('file-upload').addEventListener('change', function (event) {
        const file = event.target.files[0]; // Get the selected file
        const reader = new FileReader(); // Create a FileReader object

        reader.onload = function (event) {
            const fileView = document.getElementById("file-viewer");
            const fileContent = event.target.result; // Get the file content
            fileView.innerHTML = "<div id='file-cover-id' class='cover'></div>";
            // Do something with the file content, for example, log it to console
            let jsonData = JSON.parse(fileContent);
            Object.keys(jsonData["apps"]).forEach(ele => {
                const nc = document.createElement("div");
                nc.classList.add("item");
                nc.innerHTML = `
                
            <div class="exit">
            <label class="container">
                <input type="checkbox" checked="checked">
                <span class="checkmark"></span>
            </label>
            </div>
            <div class="title">${jsonData["apps"][ele]}</div>
            <div class="exit">x</div>
        `;
                document.getElementById("file-cover-id").appendChild(nc)
                nc.addEventListener("click", () => {
                    //  nc.remove()
                    if (document.getElementById("file-cover-id").innerHTML == "") {
                        document.getElementById("file-viewer").innerHTML = `
                            <div class="text">
                            <p>Drop config.json file here</p>
                            <label for="file-upload" class="custom-file-upload">
                                or select file
                            </label>
                            <input id="file-upload" type="file" accept=".json" />
                        </div>`
                        runFileView()
                    }
                })
            })
        };

        // Read the file as text
        reader.readAsText(file);
    });
};
runFileView();