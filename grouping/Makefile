# settings for this project
CLOSURE_LIB = ../common/closure-library
CALCDEPS = $(CLOSURE_LIB)/closure/bin/calcdeps.py
CLOSURE_BUILDER = $(CLOSURE_LIB)/closure/bin/build/closurebuilder.py
CLOSURE_COMPILER = ../common/compiler.jar
LIBPATH = js ../common/nhiro $(CLOSURE_LIB)
ENTRYPOINT = js/main.js
EXTERNS = ../common/externs/nhiro.js
JS_FILES = deps.js

# automatic settings
LIBPATH_FOR_CALCDEPS = $(patsubst %,-p %, $(LIBPATH))
LIBPATH_FOR_BUILDER = $(patsubst %,--root="%", $(LIBPATH))
EXTERNS_FOR_BUILDER = $(patsubst %,--compiler_flags="--externs=%", $(EXTERNS))
JS_FILES_FOR_BUILDER = $(patsubst %,--compiler_flags="--js=%", $(JS_FILES))

# targets
.PHONY: compile deps.js deps.txt lint watch report

compile:
	-$(CLOSURE_BUILDER) \
	    --namespace="main.main" \
	    $(LIBPATH_FOR_BUILDER) \
	    $(EXTERNS_FOR_BUILDER) \
	    $(JS_FILES_FOR_BUILDER) \
	    --output_mode=compiled --compiler_jar="$(CLOSURE_COMPILER)" \
	    -f --compilation_level=ADVANCED_OPTIMIZATIONS \
	    -f --warning_level=VERBOSE \
	    -f --jscomp_warning=visibility \
	    > /dev/null 2> new_compile.log
	mv new_compile.log compile.log
	cat compile.log


deps: deps.js deps.txt

deps.js:
	$(CALCDEPS) -i $(ENTRYPOINT) -o deps $(LIBPATH_FOR_CALCDEPS) > deps.js

deps.txt:
	$(CALCDEPS) -i $(ENTRYPOINT) -o list $(LIBPATH_FOR_CALCDEPS) > deps.txt

lint:
	-cat deps.txt | xargs gjslint > new_lint.log 2> /dev/null
	mv new_lint.log lint.log
	cat lint.log


#
# taregts for jscc
watch-start:
	python _jscc/watch.py

watch-stop:
	python _jscc/watch.py --kill

report:
	@cat lint.log
	@cat compile.log
	python _jscc/report.py
