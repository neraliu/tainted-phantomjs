SOURCES += script.cpp

CONFIG += debug

INCLUDEPATH += ../../../include/
INCLUDEPATH += ../../
INCLUDEPATH += ../../JavaScriptCore/ForwardingHeaders/

# LIBS += ../../../../../../lib/libQtWebKit.a
LIBS += ../release/libjscore.a

QMAKE_CXXFLAGS = -g

DEFINES += ENABLE_JIT=1

TARGET = script
