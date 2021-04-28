FROM public.ecr.aws/lambda/nodejs:12

RUN ulimit -n 1024 && \
yum update -y && \
yum install -y unzip \
echo \
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
echo "start thing" && \
ls && \
echo "end thing" && \
cd dist && \
ls && \
echo "end thing 2" && \
cd .. && \
rm -rf app && \
mv dist app && \
ls && \
cd app && \
ls

CMD ["app/handler.getAllNotes"]