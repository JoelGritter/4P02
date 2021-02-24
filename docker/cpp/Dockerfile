FROM gcc:latest
WORKDIR /usr/src/submission
COPY in.txt .
COPY main.cpp .
COPY cpp.sh .

RUN g++ -o subexe main.cpp
CMD ["sh", "./cpp.sh"]