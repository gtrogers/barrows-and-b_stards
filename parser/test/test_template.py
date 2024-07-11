import unittest

from parser.parser import Template


class TestTemplate(unittest.TestCase):
    def test_adding_a_node(self):
        template = Template("test")

        template.add_node("text", "hello world")

        self.assertEqual([["text", "hello world"]], template.nodes)

    def test_adding_a_node_with_multiple_values(self):
        template = Template("test")

        template.add_node("when", ["some expression", [["text", "hi there"]]])

        self.assertEqual(
            [["when", "some expression", [["text", "hi there"]]]], template.nodes
        )

    def test_can_only_add_known_nodes(self):
        template = Template("test")

        self.assertRaises(ValueError, lambda: template.add_node("woozle", "blah"))

    def test_appending_to_current_text_node(self):
        template = Template("test")

        template.add_node("text", "foobar")
        template.append_or_create_text("zap")

        self.assertEqual("foobarzap", template.nodes[0][1])

    def test_creating_a_text_node_when_one_does_not_exist(self):
        template = Template("test")
        template.append_or_create_text("zap")

        self.assertEqual(["text", "zap"], template.nodes[0])

    def test_creating_a_text_node_when_another_node_is_in_tail_position(self):
        template = Template("test")
        template.add_node("lookup", "var-name")
        template.append_or_create_text("zap")

        self.assertEqual([["lookup", "var-name"], ["text", "zap"]], template.nodes)
