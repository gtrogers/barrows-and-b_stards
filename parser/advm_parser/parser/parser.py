import json


from advm_parser.parser.nodes import (
    text_node,
    when_node,
    action_node,
    lookup_node,
    meta_node,
    SceneNode,
    MetaNode,
    append_to_text_node,
)


class Scene:
    VALID_NODE_TYPES = ["text", "lookup", "action", "when"]

    def __init__(self, slug):
        self.nodes: list[SceneNode] = []
        self.slug = slug

    def add_node(self, node: SceneNode):
        if node[0] not in Scene.VALID_NODE_TYPES:
            raise ValueError("Unknown node type: " + node[0])
        self.nodes.append(node)


class World:
    def __init__(self):
        self.scenes = {}
        self.current_scene: None | Scene = None

    def add_scene(self, slug):
        new_scene_template = Scene(slug)
        self.scenes[slug] = new_scene_template
        self.current_scene = new_scene_template

    def add_node_to_current_scene(self, node: SceneNode):
        if self.current_scene is None:
            raise ValueError("No scene exists to add node to")

        self.current_scene.add_node(node)


    def output(self) -> str:
        out = {}
        for k, v in self.scenes.items():
            out[k] = {"description": [v.nodes], "title": [text_node([v.slug])]}

        return json.dumps({"scenes": out})


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

        # HACK: parsing nested tags is currently a hack and will only
        #       with two arguments and a nesting of two.
        #       There's likely a better way to do this using regex
        nested = self.peek() == ")"
        if nested:
            self.take()

        tag_name, rest = tag_text.split("(", maxsplit=1)
        args = [s.strip() for s in rest.split(",", maxsplit=1)]

        if nested and len(args) == 2:
            args[1] += ')'

        return tag_name, args


def process_tag(name: str, args: list[str]) -> SceneNode | MetaNode:
    match (name):
        case "Scene":
            return meta_node("Scene", args)
        case "lookup":
            return lookup_node(args[0])
        case "action":
            if args[0][0] == "@":
                rl = ReadableLine(args[0])
                nodes = process_line(rl)
                return action_node(args[1], nodes)
            else:
                return action_node(args[1], [text_node([args[0]])])
        case "when":
            if args[1][0] == "@":
                rl = ReadableLine(args[1])
                nodes = process_line(rl)
                return when_node(args[0], nodes)
            return when_node(args[0], [text_node([args[1]])])


def process_line(line: ReadableLine) -> list[SceneNode]:
    nodes: list[SceneNode] = []
    current_text_node = text_node([])
    while current_char := line.peek():
        match current_char:
            case "@":
                node = process_tag(*line.take_tag())
                if node[0] == "lookup":
                    append_to_text_node(current_text_node, node)
                else:
                    nodes.append(node)
            case '\n':
                line.take()
            case _:
                append_to_text_node(current_text_node, current_char)
                line.take()

    if len(current_text_node[1]) > 0:
        nodes.append(current_text_node)

    return nodes


def parse_file_to_template(file_path: str, world: World):
    with open(file_path) as f:
        for raw_line in f.readlines():
            line = ReadableLine(raw_line)
            nodes = process_line(line)
            for node in nodes:
                if node[0] == "meta" and node[1] == "Scene":
                    world.add_scene(node[2][0])
                else:
                    world.add_node_to_current_scene(node)


def run(path):
    world = World()
    parse_file_to_template(path, world)
    print(world.output())

