# Changelog

0.7.0 / 2016-02-22
==================

  * correctly catch render component errors

0.6.0 / 2016-02-16
==================

  * source components now support incoming http requests input

0.5.1 / 2016-02-12
==================

  * update to microwork 0.7 for reconnect support

0.5.0 / 2016-02-12
==================

  * replace amqplib with microwork

0.4.0 / 2016-01-28
==================

  * less verbose logging of messages
  * add support for `responseid` for processors
  * only install new node modules if folder is not present

0.3.0 / 2016-01-07
==================

  * add way to compile render components

0.2.2 / 2015-12-21
==================

  * add info logging on connect

0.2.1 / 2015-12-21
==================

  * keep trying to connect to rabbit on fail

0.2.0 / 2015-12-21
==================

  * add correct Dockerfile
  * only log accepted messages
  * refactor and simplify code
  * allow multiple workers on same queue, only ack msgs that can be executed
  * use unique queue ids to allow horizontal scaling
  * fix continuous execution in production mode
  * distinguish between test and prod execution & allow passing command to continuously running components

v0.1.0 / 2015-12-18
===================

  * basic version that works over rabbitmq
