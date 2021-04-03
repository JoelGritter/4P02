FROM public.ecr.aws/lambda/nodejs:12

RUN sudo apt-get install unzip

COPY ./ ./
RUN npm install
RUN npm run bld
RUN rm -rf app 
RUN mv dist app
RUN ls app

CMD ["app/handler.getAllNotes"]
