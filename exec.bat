wmic process where "name='chrome.exe' and commandline like '%incognito%'" delete
start chrome --incognito "http://192.168.1.131:8080/"
http-server