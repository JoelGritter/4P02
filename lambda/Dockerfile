FROM public.ecr.aws/lambda/nodejs:12

RUN ulimit -n 1024 && \
yum update -y && \
yum install -y unzip \
dos2unix \
clang \
cmake \
java-1.8.0-openjdk \
java-1.8.0-openjdk-devel \
python3 \
yum clean all

ENV JAVA_HOME /usr/lib/jvm/java-1.8.0-openjdk/

COPY ./ ./
RUN npm install && \
npm run bld && \
rm -rf app && \
mv dist app

CMD ["app/handler.getAllNotes"]