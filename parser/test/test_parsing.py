import unittest
from parser.parser import parse_file_to_template, World, process_tag, ReadableLine, process_line
from parser.nodes import meta_node, lookup_node, action_node, text_node, when_node


class TestParsing(unittest.TestCase):
    def test_simple_example(self):
        world = World()
        parse_file_to_template("examples/simple.advm", world)

        self.assertEqual(
            [
                ("text", ["It was a dark and stormy night."]),
                ("text", ["The stove is ", ("lookup", "stove"), "."]),
                ("action", "Go to second.", [("text", ["Take a walk"])]),
                ("when", "stove", [("action", "Do nothing.", [("text", ["Make some tea"])])]),
            ],
            world.scenes["first"].nodes,
        )


class TestParsingTags(unittest.TestCase):
    def test_parsing_scene_tag(self):
        tag_name = "Scene"
        args = ["scene-slug"]
        node = process_tag(tag_name, args)
        self.assertEqual(meta_node("Scene", ["scene-slug"]), node)

    def test_parsing_lookup_tag(self):
        tag_name = "lookup"
        args = ["var-to-find"]
        node = process_tag(tag_name, args)
        self.assertEqual(lookup_node("var-to-find"), node)

    def test_parsing_action_tag_with_text(self):
        tag_name = "action"
        args = ["Do the thing", "some expression"]
        node = process_tag(tag_name, args)
        self.assertEqual(
            action_node("some expression", [text_node(["Do the thing"])]), node
        )

    def test_parsing_action_tag_with_lookup(self):
        tag_name = "action"
        args = ["@lookup(name) does the thing", "some expression"]
        node = process_tag(tag_name, args)
        self.assertEqual(
            action_node(
                "some expression", [text_node([lookup_node("name"), " does the thing"])]
            ),
            node,
        )

    def test_parsing_when_tag_with_text(self):
        tag_name = "when"
        args = ["some-var-name", "Some text"]
        node = process_tag(tag_name, args)
        self.assertEqual(when_node("some-var-name", [text_node(["Some text"])]), node)

    def test_parsing_when_tag_with_action(self):
        tag_name = "when"
        args = ["some-var-name", "@action(hello, some expression)"]
        node = process_tag(tag_name, args)
        self.assertEqual(when_node("some-var-name", [action_node("some expression", [text_node(["hello"])])]), node)


class TestParsingLines(unittest.TestCase):
    def test_blank_lines_are_ignored(self):
        line = ReadableLine("\n")
        nodes = process_line(line)
        self.assertEqual(0, len(nodes))

    def test_parsing_text_with_lookup(self):
        line = ReadableLine("Hello @lookup(world)\n")
        nodes = process_line(line)
        self.assertEqual(text_node(["Hello ", lookup_node("world")]), nodes[0])
        self.assertEqual(1, len(nodes))
