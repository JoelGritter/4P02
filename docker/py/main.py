import sys

for line in sys.stdin:
    a = int(line.strip()) + 97
    print(chr(a))