from typing import Literal, Tuple


type Text = Literal["text"]
type Lookup = Literal["lookup"]
type When = Literal["when"]
type Unless = Literal["unless"]
type Action = Literal["action"]
type Meta = Literal["meta"]
type Setup = Literal["setup"]

type LookupNode = Tuple[Lookup, str]
type TextNode = Tuple[Text, list[str | LookupNode]]
type WhenNode = Tuple[When, str, list[SceneNode]]
type UnlessNode = Tuple[Unless, str, list[SceneNode]]
type ActionNode = Tuple[Action, str, list[SceneNode]]
type SetupNode = Tuple[Setup, str]
type SceneNode = TextNode | WhenNode | ActionNode | SetupNode | UnlessNode
type MetaNode = Tuple[Meta, str, list[str]]
type TemplateNode = SceneNode | MetaNode | LookupNode


def text_node(contents: list[str | LookupNode]) -> TextNode:
    return ("text", contents)


def when_node(expression: str, contents: list[SceneNode]) -> WhenNode:
    return ("when", expression, contents)


def unless_node(expression: str, contents: list[SceneNode]) -> UnlessNode:
    return ("unless", expression, contents)


def action_node(expression: str, contents: list[SceneNode]) -> ActionNode:
    return ("action", expression, contents)


def lookup_node(varname: str) -> LookupNode:
    return ("lookup", varname)


def meta_node(name: str, args: list[str]) -> MetaNode:
    return ("meta", name, args)


def setup_node(expression: str) -> SetupNode:
    return ("setup", expression)


def append_to_text_node(text_node, content: str | LookupNode):
    if len(text_node[1]) == 0:
        text_node[1].append(content)
        return

    tail = text_node[1][-1]
    if isinstance(tail, str) and isinstance(content, str):
        text_node[1][-1] += content
    elif isinstance(tail, str) and content[0] == 'lookup':
        text_node[1].append(content)
    elif tail[0] == 'lookup' or content[0] == 'lookup':
        text_node[1].append(content)
