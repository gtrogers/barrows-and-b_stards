# Barrows and B'stards

A tongue in cheek grimdark role playing game about plundering dungeons.

## Features

- Simple browser based frontend: read text, pick options, roll dice, find out what happens
- Stories are written in 'adventure markup language' and then compiled into something the browser can render
- Very simple scripting engine so buttons can trigger actions, cause scene changes, etc

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
