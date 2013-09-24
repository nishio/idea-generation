===================
 How to contribute
===================


How to develop
==============

Sorry for lack of documents. Feel free to ask me. email: nishio (dot) hirokazu (at) gmail (dot) com.

JavaScript origins
------------------

To use Google Drive API, I have to register JavaScript origins.
They were:

  http://nishio.github.io
  http://localhost:8000
  http://localhost:8080
  http://axissoftwares.com

For development, I usually use localhost. It is easy.
You just run `$python -mSimpleHTTPServer` on the top of source tree.

However if you need to register other origins for development, please contact me.


Getting third-party libraries
-----------------------------

Some third-party libraries are not stored in the repository.
In `common/README.rst` I wrote how to get some third-party libraries.

If you see 'Uncaught ReferenceError: goog is not defined' on your develop environment,
it is because you don't put Google Closure Library correctly.


Accessing data
--------------

Currently all data for the map is stored in `main.gdcon._list`, it is CollaborativeList
(see https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeList)

In future, I'll add other lists to store other type of data.


Coding Rules
------------

- Whenever you changed goog.require or goog.provide, you have to 'make deps'
- Don't write JS code in *.html. Put them in *.js files. I want to do type-check and lint for them.
- (Recommended) Do 'make compile' to find bugs. Do 'make lint' to keep code clean. I'm using 'jscc' for automatic check. See http://nishio.github.io/jscc/


Closure Linter
--------------

I uses Closure Linter and Closure Compiler to keep codes clean.

Closure Linter
  https://developers.google.com/closure/utilities/docs/linter_howto

You can easily fix styles:

  $ fixjsstyle main.js


Closure Compiler
----------------

It give me a lot of information to fix.
It is useful even if we don't use Closure Library.

common/closure-library/closure/bin/build/closurebuilder.py \
  --namespace="main.main" \
  --root="common/closure-library" --root="." \
  --output_mode=compiled --compiler_jar=common/compiler.jar -f --compilation_level=ADVANCED_OPTIMIZATIONS \
  -f --warning_level=VERBOSE -f --jscomp_warning=visibility > compiled.js 2> compile.log

In some case you need to add options:
#    --compiler_flags="--js=deps.js" \
#    --compiler_flags="--externs=common/externs/jquery-1.7.js" \


See: 'Annotating JavaScript for the Closure Compiler' https://developers.google.com/closure/compiler/docs/js-for-compiler

When type checks are annoying you, you can use this: /** @suppress {checkTypes} */


Continuous Integration
----------------------

I use jscc for automatic type-check and lint.

http://nishio.github.io/jscc/

It uses watchdog to observe js-file's modification.

http://packages.python.org/watchdog/installation.html
