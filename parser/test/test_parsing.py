import unittest
from parser.parser import parse_file_to_template, World


class TestParsing(unittest.TestCase):
    def test_simple_example(self):
        world = World()
        parse_file_to_template("examples/simple.advm", world)

        self.assertEqual(
            [
                ("text", ["It was a dark and stormy night."]),
                ("text", ["The stove is ", ("lookup", "stove"), "."]),
                ("text", [""]),
                ("action", "Go to second.", [("text", ["Take a walk"])]),
                ("text", [""]),
            ],
            world.scenes["first"].nodes,
        )
