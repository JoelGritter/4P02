# Docker Container Interface
This doc provides instructions on how to interface with the Docker containers, including expected input and output files.

## Input - Testcases
Input testcases for the code to be tested against is expected at `in.txt`. This file will then be passed to the code as standard input. (e.g. `System.in` for Java)

Student code should be programmed in such a way that multiple test cases in the same input file should be handled, according to assignment instructions.

## Input - Target Code
Input target code should be provided at the following filepaths on the same folder level as the Dockerfile:
- c++: `main.cpp`
- Java: `main.java`

## Output - Code Output
The output of the code will be provided on the same folder, as `out.txt`.