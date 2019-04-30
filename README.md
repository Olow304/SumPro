# SumPro
Extractive Summarization built for chrome extension

Made by Saleban and Warren as Capstone project


## How to Install the app


### Get backend running
#### How to run flask API?
##### Install requirements.txt by running
```
pip isntall -r requirements.txt
```
<b>After that</b>, in your command prompt, type the command below.
```PYTHON
python Backend/Server/extractive_api_summary.py
```
If everything went well, it will say your server is running on port 5000 and the main url is, http://127.0.0.1:5000/extractive
<img width="600" src="https://i.imgur.com/nWkcMWz.jpg" >


### Get Front End

##### Loading Extension into Chrom
Go to chrome://extensions/ 
Click option to turn on developer mode
Click "Load Unpacked"
Find the SumPro-master repo
SumPro-master -> Frontend: Select folder on SumPro
