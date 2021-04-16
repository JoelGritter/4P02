FROM public.ecr.aws/lambda/nodejs:12

RUN yum update -y && yum install unzip -y
RUN yum install python3 -y

COPY ./ ./
RUN npm install
RUN npm run bld
RUN rm -rf app 
RUN mv dist app
RUN ls app

CMD ["app/handler.getAllNotes"]
