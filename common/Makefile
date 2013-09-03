get-google-closure-library:
	svn checkout http://closure-library.googlecode.com/svn/trunk/ closure-library


update-google-closure-library:
	cd closure-library; svn up


get-google-closure-compiler:
	wget http://closure-compiler.googlecode.com/files/compiler-latest.zip
	unzip -d compiler compiler-latest.zip
	mv compiler/compiler.jar .
	rm -r compiler
