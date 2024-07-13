# Barrows and B'stards

A tongue in cheek grimdark role playing game about plundering dungeons (and also a toolkit for writing your own text based adventure games).

## Features

- Simple browser based frontend: read text, pick options, roll dice, find out what happens
- Stories are written in 'adventure markup language' and then compiled into something the browser can render
- Very simple scripting engine so buttons can trigger actions, cause scene changes, etc

## advm - Adventure Markup

The rooms in the game are written using a simple markup language called adventure markup.

### Example

```advm
@Scene(a-dark-room)
@setup(Set waitCount to 0. Set candle to false.)

You are in a dark room. You have been waiting @lookup(waitCount) minutes.

The room is dark.

@when(candle, A small candle flickers in the distance.)

@action(Feel your way outside., Go outside.)
@action(Stay put., Increase waitCount.)

@Scene(outside)

You are outside. The moon looms overhead.

@action(Light a candle., Set candle to true.)
@action(Go back inside, Go to a-dark-room.)
```

The above file will create two scenes (or rooms) which the player can move between.

Adventure markup files (ending in .advm) can be compiled to json and then run
using the vue/typescript half of this project.

## Development

### Setup - Client

The client app uses parcel to compile and package the HTML, Vue, Typescript and CSS files.

You can run the development server that will automatically rebuild on changes like so:

```
npm install
npm run dev
```

#### Tests

This app uses jest for testing

```
npm run test
```

Or to run the tests in watch mode and detect changes use

```
npm run test:watch
```

### Setup - Parser

The parser (in the `./parser` directory) is written and tested in python 3. Depending on your setup you may need to swap `python` for `python3` in the following commands.

It's recommended to use a virtual env `python -m venv [name-of-env]`

#### Running the tests

```
cd parser
python -n unittest
```

## Plans / Future

At some point the 'game' and the 'framework' need to be split in half but it doesn't feel like the project has
reached that stage yet.
