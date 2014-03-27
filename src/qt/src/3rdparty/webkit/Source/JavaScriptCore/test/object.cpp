#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);
	
	JSStringRef scriptJS = JSStringCreateWithUTF8CString("");
	JSObjectRef fn = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS, NULL, 1, NULL); 

	static JSValueRef myClassGetProperty(JSContextRef ctx, JSObjectRef object, JSStringRef propertyNameJS, JSValueRef* exception) { 
		// Will be called when JavascriptCore requests propertyNameJS on your object 
		cout << "myClassGetProperty" << endl;
	}
	// Create a class definition and register it 
	JSClassDefinition myJavascriptClass = kJSClassDefinitionEmpty;
	myJavascriptClass.getProperty = myClassGetProperty;
	JSClassRef myClass = JSClassCreate(&myJavascriptClass);

	JSStringRelease(scriptJS);

	JSGlobalContextRelease(ctx);
	return 0;
}
