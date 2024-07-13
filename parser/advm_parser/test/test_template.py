import unittest

from advm_parser.parser.parser import Scene
from advm_parser.parser.parser import text_node


class TestScene(unittest.TestCase):
    def test_adding_a_node(self):
        scene = Scene("test")

        scene.add_node(text_node(["hello world"]))

        self.assertEqual([("text", ["hello world"])], scene.nodes)

    def test_can_only_add_known_nodes(self):
        scene = Scene("test")

        self.assertRaises(ValueError, lambda: scene.add_node(("frog", ["blah"])))
