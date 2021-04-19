#include <string>
#include <iostream>

int main() {
	for (int i=0; i < 4; i++) {
        int in;
        std::cin >> in;
        std::cout << (char)(in+97) << "\n";
    }
}