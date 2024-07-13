import unittest

from parser.nodes import text_node, append_to_text_node, lookup_node

class TestNodeFuncs(unittest.TestCase):
    def test_appending_text_to_text(self):
        tn = text_node(["hello"])
        append_to_text_node(tn, " world")
        self.assertEqual("hello world", tn[1][0])

    def test_appending_lookup_to_text(self):
        tn = text_node(["hello"])
        append_to_text_node(tn, lookup_node("wibble"))
        self.assertEqual("hello", tn[1][0])
        self.assertEqual(lookup_node("wibble"), tn[1][1])

    def test_appending_text_to_lookup(self):
        tn = text_node([lookup_node("blah")])
        append_to_text_node(tn, "world")
        self.assertEqual(text_node([lookup_node("blah"), "world"]), tn)

    def test_appending_lookup_to_lookup(self):
        tn = text_node([lookup_node("blah")])
        append_to_text_node(tn, lookup_node("wibble"))
        self.assertEqual(text_node([lookup_node("blah"), lookup_node("wibble")]), tn)

    def test_appending_text_to_empty_node(self):
        tn = text_node([])
        append_to_text_node(tn, "hello")
        self.assertEqual(text_node(["hello"]), tn)

    def test_appending_lookup_to_empty_node(self):
        tn = text_node([])
        append_to_text_node(tn, lookup_node("hello"))
        self.assertEqual(text_node([lookup_node("hello")]), tn)
