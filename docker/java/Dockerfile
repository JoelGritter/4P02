FROM openjdk:7
WORKDIR /usr/src/submission
COPY in.txt .
COPY Main.java .
COPY java.sh .

RUN javac Main.java
CMD ["sh", "java.sh"]