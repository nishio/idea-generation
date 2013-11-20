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

	cp ../idea-generation/common/rgbcolor.js common/
	cp ../idea-generation/common/jquery.svg.min.js common/
	cp ../idea-generation/common/canvg.js common/
	cp ../idea-generation/common/StackBlur.js common/

	-rm ../idea-generation/collecting/**/*~
	-mkdir collecting
	python ../idea-generation/collecting/ready_deploy.py
	cp ../idea-generation/collecting/deploy/index.html collecting
	cp ../idea-generation/collecting/deploy/manifest.webapp collecting
	cp ../idea-generation/collecting/basic.css collecting
	cp ../idea-generation/collecting/deps.js collecting
	cp -r ../idea-generation/collecting/js collecting
