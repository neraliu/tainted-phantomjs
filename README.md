# Tainted PhantomJS
Tainted Phantomjs (TPJS) is the scriptable tool for DOM-based XSS detection. It is built based on the open source PhantomJS ([www.phantomjs.org](http://phantomjs.org)) by hacking the JavaScriptCore and WebKit engine with the tainted signal. With the scripting capabilities of the PhantomJS and well adoption of Phatomjs as QE automation tool, Tainted PhantomJS is highly customizable for HTML5 web applications for DOM-based XSS detection by adding few lines in the original test suites.

## Travis CI

| Branch   | Build Status    |
|:--------:|:---------------:|
| `master` | [![Build Status](https://travis-ci.org/neraliu/tpjs.svg?branch=master)](https://travis-ci.org/neraliu/tpjs) |
| `devel`  | [![Build Status](https://travis-ci.org/neraliu/tpjs.svg?branch=devel)](https://travis-ci.org/neraliu/tpjs) |
