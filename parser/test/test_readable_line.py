import unittest

from parser.parser import ReadableLine


class TestReadableLine(unittest.TestCase):
    def test_taking_chars(self):
        line = ReadableLine("abcd");
        first = line.take()
        second = line.take()
        third = line.take()
        fourth = line.take()
        fifth = line.take()

        self.assertEqual("a", first)
        self.assertEqual("b", second)
        self.assertEqual("c", third)
        self.assertEqual("d", fourth)
        self.assertEqual(None, fifth)

    def test_taking_until_next_char(self):
        line = ReadableLine("hello wor4ld")
        result = line.take_until("4")

        self.assertEqual("hello wor4", result)

    def test_peeking(self):
        line = ReadableLine("abcd");
        line.take()
        line.take()
        peaked = line.peek()
        taken = line.take()

        self.assertEqual("c", peaked)
        self.assertEqual("c", taken)

    def test_peeking_past_the_end_returns_none(self):
        line = ReadableLine("abc");
        [line.take() for _ in range(3)]
        peaked = line.peek()

        self.assertIsNone(peaked)


    def test_taking_a_tag(self):
        line = ReadableLine("Some words go here!@lookup(foo, bar)")
        # NB the '!' is just here for testing, normally we'd use
        #    peak to find the right spot

        line.take_until('!')
        tag_name, args = line.take_tag()

        self.assertEqual("lookup", tag_name)
        self.assertEqual(["foo", "bar"], args)

    def test_raises_error_when_not_at_tag(self):
        line = ReadableLine("no tags here")
        self.assertRaises(IndexError, lambda: line.take_tag())

