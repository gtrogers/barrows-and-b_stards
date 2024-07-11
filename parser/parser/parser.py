import sys
import json


class Template:
    NODE_TYPES = ["text", "lookup", "action", "when"]

    def __init__(self, slug):
        self.nodes = []
        self.slug = slug

    def add_node(self, node_name: str, content: str | list):
        if node_name not in Template.NODE_TYPES:
            raise ValueError("Unrecognised node type: " + node_name)

        new_node = [node_name]

        if type(content) is str:
            new_node.append(content)
        else:
            new_node += content

        self.nodes.append(new_node)

    def append_or_create_text(self, text_content: str):
        if len(self.nodes) == 0 or self.nodes[-1][0] != "text":
            self.add_node("text", text_content)
        else:
            self.nodes[-1][1] += text_content


class World:
    def __init__(self):
        self.scenes = {}
        self.current_scene: None | Template = None

    def add_scene_template(self, slug):
        new_scene_template = Template(slug)
        self.scenes[slug] = new_scene_template
        self.current_scene = new_scene_template

    def output(self) -> str:
        out = {}
        for k, v in self.scenes.items():
            # TODO: support multi paragraphs
            out[k] = { 'description': [v.nodes], 'title': [["text", v.slug]] }

        return json.dumps({ "scenes": out })


class ReadableLine:
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
        return "".join(found_chars)

    def take_tag(self):
        if self.peek() != "@":
            raise IndexError("No tag found at position {}".format(self.index))

        self.take()
        tag_text = self.take_until(")")[0:-1]
        tag_name, rest = tag_text.split("(")
        return tag_name, [s.strip() for s in rest.split(",")]


def process_tag(name: str, args: list[str], world: World):
    match (name):
        case "Scene":
            world.add_scene_template(args[0])
        case "action":
            current_scene = world.current_scene
            if current_scene is None:
                #TODO: refactor - example of tell over ask
                raise ValueError("There is no current scene to add tags to.")
            # TODO - support proper node nesting
            current_scene.add_node(name, [args[1], [["text", args[0]]]])
        case _:
            if world.current_scene is None:
                raise ValueError("There are no scene templates to add tags to.")
            world.current_scene.add_node(name, args)


def process_line_to_template(line: ReadableLine, world: World):
    while current_char := line.peek():
        match current_char:
            case "@":
                tag_name, args = line.take_tag()
                process_tag(tag_name, args, world)
            case '\n':
                line.take()
            case _:
                if world.current_scene is None:
                    raise ValueError("There are no scene templates to add text to.")
                char = line.take()
                # FIXME - this is a typing thing, we know char is never None here
                # TODO - this is likely very slow and would benefit from a string builder
                #        or similar pattern
                world.current_scene.append_or_create_text(char or "")


def parse_file_to_template(file_path: str, world: World):
    with open(file_path) as f:
        for raw_line in f.readlines():
            line = ReadableLine(raw_line)
            process_line_to_template(line, world)


def run(path):
    world = World()
    parse_file_to_template(path, world)
    print(world.output())


if __name__ == "__main__":
    run(sys.argv[1])
