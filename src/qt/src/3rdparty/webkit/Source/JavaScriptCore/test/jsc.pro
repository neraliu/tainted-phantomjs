SOURCES += jsc.cpp

CONFIG += release

# INCLUDEPATH += /opt/local/include/
# INCLUDEPATH += /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.7.sdk/usr/

INCLUDEPATH += ../
INCLUDEPATH += ../API/
INCLUDEPATH += ../assembler/
INCLUDEPATH += ../bytecode/
INCLUDEPATH += ../bytecompiler/
INCLUDEPATH += ../debugger/
INCLUDEPATH += ../dfg/
INCLUDEPATH += ../generated/
INCLUDEPATH += ../heap/
INCLUDEPATH += ../interpreter/
INCLUDEPATH += ../jit/
INCLUDEPATH += ../parser/
INCLUDEPATH += ../profiler/
INCLUDEPATH += ../runtime/
INCLUDEPATH += ../wtf/

LIBS += ../../../../../../lib/libQtWebKit.a
# LIBS += -lQtWebKit

#
# BUG: http://d.hatena.ne.jp/higepon/20110817/1313548943
#
# QMAKE_CXXFLAGS += -DENABLE_SINGLE_THREADED=1
DEFINES += ENABLE_SINGLE_THREADED=1

mac {
    QMAKE_CXXFLAGS += -fvisibility=hidden
    # QMAKE_LFLAGS += '-sectcreate __TEXT __info_plist Info.plist'
    # CONFIG -= app_bundle
# Uncomment to build a Mac OS X Universal Binary (i.e. x86 + ppc)
#    CONFIG += x86 ppc
}

TARGET = jsc
