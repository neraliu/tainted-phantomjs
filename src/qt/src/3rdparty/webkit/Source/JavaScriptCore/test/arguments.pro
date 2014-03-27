SOURCES += arguments.cpp

CONFIG += debug

INCLUDEPATH += ../../../include/
INCLUDEPATH += ../../
INCLUDEPATH += ../../JavaScriptCore/ForwardingHeaders/

LIBS += ../../../../../../lib/libQtWebKit.a

QMAKE_CXXFLAGS = -g

TARGET = arguments
