#include <iostream>
#include <fstream>

int main() {

    int cur;

    for(int i = 0; i < 5; i++){
        std::cin >> cur;
        std::cout << "Current number * 2: " << (2*cur) << std::endl;
    }

    return 0;
}