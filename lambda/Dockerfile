FROM public.ecr.aws/lambda/nodejs:12

RUN ulimit -n 1024 && \
yum update -y && \
yum install -y unzip \
dos2unix \
<<<<<<< HEAD
clang \
cmake \
java-1.8.0-openjdk \
java-1.8.0-openjdk-devel \
python3 \
=======
gcc \
gcc-c++ \
java-1.8.0-openjdk \
java-1.8.0-openjdk-devel \
python3 && \
>>>>>>> 5b0f281... tmp commit
yum clean all

ENV JAVA_HOME /usr/lib/jvm/java-1.8.0-openjdk/

COPY ./ ./
RUN npm install
RUN npm run bld
RUN rm -rf app 
RUN mv dist app
RUN ls app

CMD ["app/handler.getAllNotes"]