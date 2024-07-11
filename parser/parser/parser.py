import sys


class ReadableLine():
    def __init__(self, line):
        self.index = 0
        self.line = line

    def peek(self):
        if self.index < len(self.line):
            return self.line[self.index]

    def take(self):
        if self.index < len(self.line):
            old_index = self.index
            self.index = self.index + 1
            return self.line[old_index]

    def take_until(self, target):
        found_chars = []
        found = self.take()
        while found != target:
            if found == None:
                raise IndexError("Reached end of file while looking for " + target)
            found_chars.append(found)
            found = self.take()

        found_chars.append(found)
        return ''.join(found_chars)

    def take_tag(self):
        if self.peek() != '@':
            raise IndexError("No tag found at position {}".format(self.index))

        self.take()
        tag_text = self.take_until(')')[0:-1]
        tag_name, rest = tag_text.split('(')
        return tag_name, [s.strip() for s in rest.split(',')]


def run(path):
    with open(path) as f:
        contents = f.read()
        print(contents)


if __name__ == "__main__":
    run(sys.argv[1])

