deploy:
	make copy
	git add -u
	-git commit -m 'update'
	# assert workspace is clean, if not, do 'git add' manually
	test -z "`git status --porcelain`"
	git push

copy:
	-rm ../idea-generation/grouping/**/*~
	-mkdir grouping
	cp ../idea-generation/grouping/deps.js grouping
	cp ../idea-generation/grouping/index.html grouping
	cp ../idea-generation/grouping/entrypoint.js grouping
	cp ../idea-generation/grouping/basic.css grouping
	cp -r ../idea-generation/grouping/js grouping

	-rm ../idea-generation/common/nhiro/**/*~
	cp -r ../idea-generation/common/nhiro common/

	rsync ../idea-generation/common/closure-library common/
	cp ../idea-generation/common/raphael.js common/
	cp ../idea-generation/common/realtime-client-utils.js common/

	-rm ../idea-generation/collecting/**/*~
	-mkdir collecting
	cp ../idea-generation/collecting/index.html collecting
	cp ../idea-generation/collecting/manifest.webapp collecting
	cp ../idea-generation/collecting/basic.css collecting
	cp -r ../idea-generation/collecting/js collecting
