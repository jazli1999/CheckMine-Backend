FROM nikolaik/python-nodejs:python3.9-nodejs16

WORKDIR /home/backend

COPY . ./

RUN pip install -r scripts/requirements.txt
RUN npm install

CMD ["bash", "scripts/startService.sh"]