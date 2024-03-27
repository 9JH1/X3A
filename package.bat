:: make sure that npm and python is installed, also make sure that all of the modules in the main.py file are installed beforehand
npm install 
pip install pyinstaller
python -m PyInstaller --onefile /assets/main.py
npm pack
npm build
cd main 
dir