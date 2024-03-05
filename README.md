<img alt="logo" src="https://www.objectionary.com/cactus.svg" height="92px" />

[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)
[![We recommend IntelliJ IDEA](https://www.elegantobjects.org/intellij-idea.svg)](https://www.jetbrains.com/idea/)

## eo2js

EOLANG to JavaScript transpiler and runner

[//]: # ([![grunt]&#40;https://github.com/objectionary/eoc/actions/workflows/grunt.yml/badge.svg&#41;]&#40;https://github.com/objectionary/eoc/actions/workflows/grunt.yml&#41;)
[//]: # ([![node-current]&#40;https://img.shields.io/node/v/eolang&#41;]&#40;https://www.npmjs.com/package/eolang&#41;)
[//]: # ([![PDD status]&#40;http://www.0pdd.com/svg?name=objectionary/eoc&#41;]&#40;http://www.0pdd.com/p?name=objectionary/eoc&#41;)
[//]: # ([![Hits-of-Code]&#40;https://hitsofcode.com/github/objectionary/eoc&#41;]&#40;https://hitsofcode.com/view/github/objectionary/eoc&#41;)
[//]: # ([![License]&#40;https://img.shields.io/badge/license-MIT-green.svg&#41;]&#40;https://github.com/objectionary/eoc/blob/master/LICENSE.txt&#41;)

[//]: # (First, you install [npm]&#40;https://docs.npmjs.com/downloading-and-installing-node-js-and-npm&#41;)

[//]: # (and [Java SE]&#40;https://www.oracle.com/java/technologies/downloads/&#41;.)

[//]: # ()
[//]: # (Then, you install [eolang]&#40;https://www.npmjs.com/package/eolang&#41; package:)

[//]: # ()
[//]: # (```)

[//]: # ($ npm install -g eolang)

[//]: # (```)

[//]: # ()
[//]: # (Then, you write a simple [EO]&#40;https://www.eolang.org&#41; program in `hello.eo` file)

[//]: # (in the current directory:)

[//]: # ()
[//]: # (```)

[//]: # ([args] > hello)

[//]: # (  QQ.io.stdout > @)

[//]: # (    "Hello, world!\n")

[//]: # (```)

[//]: # ()
[//]: # (Then, you run it:)

[//]: # ()
[//]: # (```)

[//]: # ($ eoc dataize hello)

[//]: # (```)

[//]: # ()
[//]: # (That's it.)

[//]: # ()
[//]: # (## Commands)

[//]: # ()
[//]: # (You can also do many other things with `eoc` commands)

[//]: # (&#40;the flow is explained in [this blog post]&#40;https://www.yegor256.com/2021/10/21/objectionary.html&#41;&#41;:)

[//]: # ()
[//]: # (  * `register` finds necessary EO files and registers them in a JSON catalog)

[//]: # (  * `assemble` parses EO files into XMIR, optimizes them, and pulls foreign EO objects)

[//]: # (  * `transpile` converts XMIR to target programming language &#40;Java by default&#41;)

[//]: # (  * `compile` converts target language sources to binaries)

[//]: # (  * `link` puts all binaries together into a single executable binary)

[//]: # (  * `dataize` dataizes a single object from the executable binary)

[//]: # (  * `test` dataizes all visible unit tests)

[//]: # ()
[//]: # (There are also commands that help manipulate with XMIR and EO sources )

[//]: # (&#40;the list is not completed, while some of them are not implemented as of yet&#41;:)

[//]: # ()
[//]: # (  * `audit` inspects all required packages and reports their status)

[//]: # (  * `foreign` inspects all objects found in the program after `assemble` step)

[//]: # (  * `sodg` generates SODG from XMIR, further rederable as XML or [Dot]&#40;https://en.wikipedia.org/wiki/DOT_%28graph_description_language%29&#41;)

[//]: # (  * `phi` generates PHI files from XMIR)

[//]: # (  * `unphi` generates XMIR files from PHI files)

[//]: # (  * `print` generates EO files from PHI files)

[//]: # (  * <del>`translate` converts Java/C++/Python/etc. program to EO program</del>)

[//]: # (  * <del>`demu` removes `cage` and `memory` objects</del>)

[//]: # (  * <del>`dejump` removes `goto` objects</del>)

[//]: # (  * <del>`infer` suggests object names where it's possible to infer them</del>)

[//]: # (  * <del>`flatten` moves inner objects to upper level</del>)

[//]: # ()
[//]: # (This command line toolkit simply integrates other tools available in)

[//]: # ([@objectionary]&#40;https://github.com/objectionary&#41; GitHub organization.)

## How to Contribute

First, run `npm install`. Then, run `grunt`. All tests should pass.

If you want to run a single test:

```
$ npm test -- test/test_mvnw.js
```

Make your changes and then [make](https://www.yegor256.com/2014/04/15/github-guidelines.html) a pull request.
