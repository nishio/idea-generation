======
 JSCC
======

http://nishio.github.io/jscc/

=========
 Install
=========

ln -s $(JSCC_DIR)/client/report.py
ln -s $(JSCC_DIR)/client/watch.py
ln -s $(JSCC_DIR)/client/build.sh


============
 Run server
============

$(JSCC_DIR)/server/server.py


================
 Start watchdog
================

./watch.py


================
 Kill watchdog
================

./watch.py --kill
