/*
 * Copyright (C) 2014 Yahoo! Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY YAHOO! INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL YAHOO! INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

#include "config.h"
#include "TaintedUtils.h"

#include "StringObject.h"

namespace JSC {

string TaintedUtils::UString2string(const UString& u)
{
	// we just peek 20 bytes of data.
        int size = 20;
        char msg[size];
        string str;
        stringstream msgss;
        snprintf(msg, size, "%s", u.utf8(true).data());
        msgss << msg;
        msgss >> str;
        return str;
}

unsigned int TaintedUtils::isTainted(ExecState* exec, JSValue& thisValue)
{
	unsigned int tainted = 0;
	if (thisValue.isString() && thisValue.isTainted()) {
		tainted = thisValue.isTainted();
		return tainted;
	}
	if (thisValue.inherits(&StringObject::s_info) && asStringObject(thisValue)->isTainted()) {
		StringObject* sobj = asStringObject(thisValue);
		tainted = sobj->isTainted();
		return tainted;
	}
	if (thisValue.isObject()) {
        	UString s = thisValue.toString(exec);
		if (s.isTainted()) {
                	tainted = s.isTainted();
			return tainted;
		}
    	}
	return tainted;
}

} // namespace JSC
