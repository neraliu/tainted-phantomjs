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

#ifndef TaintedTrace_h
#define TaintedTrace_h

#include <string>
#include <vector>
#include <stdio.h>

using namespace std;

namespace JSC {

	class TaintedStructure {
		public:
			unsigned int taintedno;
			string internalfunc;
			string jsfunc;
			string action;
			string value;
	};

	class TaintedTrace {
                public:
                        static TaintedTrace* getInstance();
			vector<TaintedStructure> getTrace();	
			void addTaintedTrace(TaintedStructure s);
			void clearTrace();
                private:
                        TaintedTrace();
                        ~TaintedTrace();
                        static TaintedTrace* m_taintedtrace;
			vector<TaintedStructure> m_trace;
	};

} // namespace JSC

#endif // TaintedTrace_h
