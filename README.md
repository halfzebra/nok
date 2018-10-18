# 👟 nok

[![npm version](https://badge.fury.io/js/nok.svg)](https://badge.fury.io/js/nok)

Run your scripts from `package.json` using a prompt in a terminal.

![nok terminal example](https://user-images.githubusercontent.com/3983879/45908649-e61f8100-bdfd-11e8-989b-107fd530ebc9.gif)

## Installation

```sh
npm install nok -g
```

## Usage

Run the `nok` command inside your Node.js project root folder:

```sh
nok
```

Run `nok --filterHooks` command inside your Node.js project root folder if you
want to filter hooks from the menu. With the `--filterHooks` flag being set,
only scripts names will be displayed and every pre/post hooks won't be
displayed:

```sh
nok --filterHooks
```
