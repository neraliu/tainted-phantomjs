/*
 *  Copyright (C) 1999-2000 Harri Porten (porten@kde.org)
 *  Copyright (C) 2002, 2005, 2006, 2007, 2008, 2009 Apple Inc. All rights reserved.
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Library General Public
 *  License as published by the Free Software Foundation; either
 *  version 2 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Library General Public License for more details.
 *
 *  You should have received a copy of the GNU Library General Public License
 *  along with this library; see the file COPYING.LIB.  If not, write to
 *  the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 *  Boston, MA 02110-1301, USA.
 *
 */

/*
 * Portions of this code are Copyright (C) 2014 Yahoo! Inc. Licensed 
 * under the LGPL license.
 * 
 * Author: Nera Liu <neraliu@yahoo-inc.com>
 *
 */
#ifndef Operations_h
#define Operations_h

#include "ExceptionHelpers.h"
#include "Interpreter.h"
#include "JSString.h"
#include "JSValueInlineMethods.h"

#if defined(JSC_TAINTED)
#include "TaintedCounter.h"
#include "TaintedTrace.h"
#include "TaintedUtils.h"
#include <sstream>
#endif

namespace JSC {

    NEVER_INLINE JSValue jsAddSlowCase(CallFrame*, JSValue, JSValue);
    JSValue jsTypeStringForValue(CallFrame*, JSValue);
    bool jsIsObjectType(JSValue);
    bool jsIsFunctionType(JSValue);

    ALWAYS_INLINE JSValue jsString(ExecState* exec, JSString* s1, JSString* s2)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, JSString* s1, JSString* s2)" << ":";
std::cerr << s1->length() << ":" << s2->length() << std::endl;
#endif

        unsigned length1 = s1->length();
        if (!length1)
            return s2;
        unsigned length2 = s2->length();
        if (!length2)
            return s1;
        if ((length1 + length2) < length1)
            return throwOutOfMemoryError(exec);

        unsigned fiberCount = s1->fiberCount() + s2->fiberCount();
        JSGlobalData* globalData = &exec->globalData();

#if defined(JSC_TAINTED_DEBUG)
// the s1 and s2 will carry the tainted information, and the following function will do the propagation
// JSString(JSGlobalData* globalData, unsigned fiberCount, JSString* s1, JSString* s2)
#endif
        if (fiberCount <= JSString::s_maxInternalRopeLength)
            return new (globalData) JSString(globalData, fiberCount, s1, s2);

        JSString::RopeBuilder ropeBuilder(fiberCount);
        if (UNLIKELY(ropeBuilder.isOutOfMemory()))
            return throwOutOfMemoryError(exec);
        ropeBuilder.append(s1);
        ropeBuilder.append(s2);
#if defined(JSC_TAINTED)
#if defined(JSC_TAINTED_DEBUG)
// this block of code explain why there is no need to have tainted check in the following call
// JSString(JSGlobalData* globalData, PassRefPtr<RopeImpl> rope)
#endif
	unsigned int tainted = 0;
	// the JSString constructor has set the default value of m_tainted=0, 
	// however, some strings are constructed by Rope which does not have the members variable m_tainted.
	// so isTainted() returns non-zero number does not mean tainted.
	//
	// the below idea is hacky to filter out non-positive number and we only allow JSC_MAX_TAINTED to trace in TPJS
	//
	// if (s1->isTainted()) {
	if (s1->isTainted() && s1->isTainted() > 0 && s1->isTainted() <= JSC_MAX_TAINTED) {
		tainted = s1->isTainted();
	}
	// if (s2->isTainted()) {
	if (s2->isTainted() && s2->isTainted() > 0 && s2->isTainted() <= JSC_MAX_TAINTED) {
		tainted = s2->isTainted();
	}
	JSString* s = new (globalData) JSString(globalData, ropeBuilder.release());
	if (tainted) {
		s->setTainted(tainted); 
	} else {
		s->setTainted(0);
	}

	if (tainted) {
		TaintedStructure trace_struct;
		trace_struct.taintedno = tainted;
		trace_struct.internalfunc = "jsString";
		trace_struct.jsfunc = "String.operations.1";
		trace_struct.action = "propagate";
                trace_struct.value = TaintedUtils::UString2string(s1->string()) + TaintedUtils::UString2string(s2->string());

		TaintedTrace* trace = TaintedTrace::getInstance();
		trace->addTaintedTrace(trace_struct);
    	}

  	return s;
#else 
        return new (globalData) JSString(globalData, ropeBuilder.release());
#endif
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, const UString& u1, JSString* s2)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, const UString& u1, JSString* s2)" << ":";
std::cerr << u1.length() << ":" << s2->length() << std::endl;
#endif

        unsigned length1 = u1.length();
        if (!length1)
            return s2;
        unsigned length2 = s2->length();
        if (!length2)
            return jsString(exec, u1);
        if ((length1 + length2) < length1)
            return throwOutOfMemoryError(exec);

        unsigned fiberCount = 1 + s2->fiberCount();
        JSGlobalData* globalData = &exec->globalData();

#if defined(JSC_TAINTED_DEBUG)
// the u1 and s2 will carry the tainted information, and the following function will do the propagation
// JSString(globalData, fiberCount, u1, s2);
#endif
        if (fiberCount <= JSString::s_maxInternalRopeLength)
            return new (globalData) JSString(globalData, fiberCount, u1, s2);

        JSString::RopeBuilder ropeBuilder(fiberCount);
        if (UNLIKELY(ropeBuilder.isOutOfMemory()))
            return throwOutOfMemoryError(exec);
        ropeBuilder.append(u1);
        ropeBuilder.append(s2);
#if defined(JSC_TAINTED)
#if defined(JSC_TAINTED_DEBUG)
// this block of code explain why there is no need to have tainted check in the following call
// JSString(JSGlobalData* globalData, PassRefPtr<RopeImpl> rope)
#endif
	unsigned int tainted = 0;
	// if (u1.isTainted()) {
	if (u1.isTainted() && u1.isTainted() > 0 && u1.isTainted() <= JSC_MAX_TAINTED) {
		tainted = u1.isTainted();
	}
	// if (s2->isTainted()) {
	if (s2->isTainted() && s2->isTainted() > 0 && s2->isTainted() <= JSC_MAX_TAINTED) {
		tainted = s2->isTainted();
	}
	JSString* s = new (globalData) JSString(globalData, ropeBuilder.release());
	if (tainted) {
		s->setTainted(tainted); 
	} else {
		s->setTainted(0);
	}

	if (tainted) {
        	TaintedStructure trace_struct;
		trace_struct.taintedno = tainted;
		trace_struct.internalfunc = "jsString";
		trace_struct.jsfunc = "String.operations.2";
		trace_struct.action = "propagate";
                trace_struct.value = TaintedUtils::UString2string(u1) + TaintedUtils::UString2string(s2->string());

		TaintedTrace* trace = TaintedTrace::getInstance();
		trace->addTaintedTrace(trace_struct);
    	}

  	return s;
#else 
        return new (globalData) JSString(globalData, ropeBuilder.release());
#endif
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, JSString* s1, const UString& u2)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, JSString* s1, const UString& u2)" << ":";
std::cerr << s1->length() << ":" << u2.length() << std::endl;
#endif

        unsigned length1 = s1->length();
        if (!length1)
            return jsString(exec, u2);
        unsigned length2 = u2.length();
        if (!length2)
            return s1;
        if ((length1 + length2) < length1)
            return throwOutOfMemoryError(exec);

        unsigned fiberCount = s1->fiberCount() + 1;
        JSGlobalData* globalData = &exec->globalData();

#if defined(JSC_TAINTED_DEBUG)
// the s1 and u2 will carry the tainted information, and the following function will do the propagation
// JSString(globalData, fiberCount, s1, u2);
#endif
        if (fiberCount <= JSString::s_maxInternalRopeLength)
            return new (globalData) JSString(globalData, fiberCount, s1, u2);

        JSString::RopeBuilder ropeBuilder(fiberCount);
        if (UNLIKELY(ropeBuilder.isOutOfMemory()))
            return throwOutOfMemoryError(exec);
        ropeBuilder.append(s1);
        ropeBuilder.append(u2);
#if defined(JSC_TAINTED)
#if defined(JSC_TAINTED_DEBUG)
// this block of code explain why there is no need to have tainted check in the following call
// JSString(JSGlobalData* globalData, PassRefPtr<RopeImpl> rope)
#endif
	unsigned int tainted = 0;
	// if (s1->isTainted()) {
	if (s1->isTainted() && s1->isTainted() > 0 && s1->isTainted() <= JSC_MAX_TAINTED) {
		tainted = s1->isTainted();
	}
	// if (u2.isTainted()) {
	if (u2.isTainted() && u2.isTainted() > 0 && u2.isTainted() <= JSC_MAX_TAINTED) {
		tainted = u2.isTainted();
	}
	JSString* s = new (globalData) JSString(globalData, ropeBuilder.release());
	if (tainted) {
		s->setTainted(tainted); 
	} else {
		s->setTainted(0);
	}

	if (tainted) {
        	TaintedStructure trace_struct;
		trace_struct.taintedno = tainted;
		trace_struct.internalfunc = "jsString";
		trace_struct.jsfunc = "String.operations.3";
		trace_struct.action = "propagate";
                trace_struct.value = TaintedUtils::UString2string(s1->string()) + TaintedUtils::UString2string(u2);

		TaintedTrace* trace = TaintedTrace::getInstance();
		trace->addTaintedTrace(trace_struct);
    	}

  	return s;
#else 
        return new (globalData) JSString(globalData, ropeBuilder.release());
#endif
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, const UString& u1, const UString& u2)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, const UString& u1, const UString& u2)" << ":";
std::cerr << u1.length() << ":" << u2.length() << std::endl;
#endif

        unsigned length1 = u1.length();
        if (!length1)
            return jsString(exec, u2);
        unsigned length2 = u2.length();
        if (!length2)
            return jsString(exec, u1);
        if ((length1 + length2) < length1)
            return throwOutOfMemoryError(exec);

#if defined(JSC_TAINTED_DEBUG)
// the u1 and u2 will carry the tainted information, and the following function will do the propagation
// JSString(globalData, fiberCount, u1, u2);
#endif
        JSGlobalData* globalData = &exec->globalData();
        return new (globalData) JSString(globalData, u1, u2);
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, const UString& u1, const UString& u2, const UString& u3)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, const UString& u1, const UString& u2, const UString& u3)" << ":";
std::cerr << u1.length() << ":" << u2.length() << ":" << u3.length() << std::endl;
#endif

        unsigned length1 = u1.length();
        unsigned length2 = u2.length();
        unsigned length3 = u3.length();
        if (!length1)
            return jsString(exec, u2, u3);
        if (!length2)
            return jsString(exec, u1, u3);
        if (!length3)
            return jsString(exec, u1, u2);

        if ((length1 + length2) < length1)
            return throwOutOfMemoryError(exec);
        if ((length1 + length2 + length3) < length3)
            return throwOutOfMemoryError(exec);

#if defined(JSC_TAINTED_DEBUG)
// the u1, u2 and u3 will carry the tainted information, and the following function will do the propagation
// JSString(globalData, u1, u2, u3);
#endif
        JSGlobalData* globalData = &exec->globalData();
        return new (globalData) JSString(globalData, u1, u2, u3);
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, Register* strings, unsigned count)
    {
#if defined(JSC_TAINTED_DEBUG)
// std::cerr << "jsString(ExecState* exec, Register* strings, unsigned count)" << std::endl;
#endif

        ASSERT(count >= 3);

        unsigned fiberCount = 0;
        for (unsigned i = 0; i < count; ++i) {
            JSValue v = strings[i].jsValue();
            if (LIKELY(v.isString()))
                fiberCount += asString(v)->fiberCount();
            else
                ++fiberCount;
        }

#if defined(JSC_TAINTED_DEBUG)
// the v1, v2 and v3 will carry the tainted information, and the following function will do the propagation
// JSString(globalData, v1, v2, v3);
#endif
        JSGlobalData* globalData = &exec->globalData();
        if (fiberCount == 3)
            return new (globalData) JSString(exec, strings[0].jsValue(), strings[1].jsValue(), strings[2].jsValue());

        JSString::RopeBuilder ropeBuilder(fiberCount);
        if (UNLIKELY(ropeBuilder.isOutOfMemory()))
            return throwOutOfMemoryError(exec);

        unsigned length = 0;
        bool overflow = false;

#if defined(JSC_TAINTED)
	unsigned int tainted = 0;
#endif
        for (unsigned i = 0; i < count; ++i) {
            JSValue v = strings[i].jsValue();
#if defined(JSC_TAINTED)
            if (LIKELY(v.isString())) {
	        if (asString(v)->isTainted()) {
			tainted = asString(v)->isTainted();
		}
                ropeBuilder.append(asString(v));
            } else {
	        if (v.toString(exec).isTainted()) {
			tainted = v.toString(exec).isTainted();
		}
                ropeBuilder.append(v.toString(exec));
	    }
#else
            if (LIKELY(v.isString()))
                ropeBuilder.append(asString(v));
            else
                ropeBuilder.append(v.toString(exec));
#endif

            unsigned newLength = ropeBuilder.length();
            if (newLength < length)
                overflow = true;
            length = newLength;
        }

        if (overflow)
            return throwOutOfMemoryError(exec);

#if defined(JSC_TAINTED)
#if defined(JSC_TAINTED_DEBUG)
// this block of code explain why there is no need to have tainted check in the following call
// JSString(JSGlobalData* globalData, PassRefPtr<RopeImpl> rope)
#endif
	JSString* s = new (globalData) JSString(globalData, ropeBuilder.release());
	if (tainted) {
		s->setTainted(tainted); 
	} else {
		s->setTainted(0);
	}

	if (tainted) {
	    TaintedStructure trace_struct;
	    trace_struct.taintedno = tainted;
	    trace_struct.internalfunc = "jsString";
	    trace_struct.jsfunc = "String.operations.4";
	    trace_struct.action = "propagate";
	    trace_struct.value = TaintedUtils::UString2string(s->string());

	    TaintedTrace* trace = TaintedTrace::getInstance();
	    trace->addTaintedTrace(trace_struct);
    	}

  	return s;
#else
        return new (globalData) JSString(globalData, ropeBuilder.release());
#endif
    }

    ALWAYS_INLINE JSValue jsString(ExecState* exec, JSValue thisValue)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsString(ExecState* exec, JSValue thisValue)" << std::endl;
#endif

        unsigned fiberCount = 0;
        if (LIKELY(thisValue.isString()))
            fiberCount += asString(thisValue)->fiberCount();
        else
            ++fiberCount;
        for (unsigned i = 0; i < exec->argumentCount(); ++i) {
            JSValue v = exec->argument(i);
            if (LIKELY(v.isString()))
                fiberCount += asString(v)->fiberCount();
            else
                ++fiberCount;
        }

        JSString::RopeBuilder ropeBuilder(fiberCount);
        if (UNLIKELY(ropeBuilder.isOutOfMemory()))
            return throwOutOfMemoryError(exec);

        if (LIKELY(thisValue.isString()))
            ropeBuilder.append(asString(thisValue));
        else
            ropeBuilder.append(thisValue.toString(exec));

        unsigned length = 0;
        bool overflow = false;

#if defined(JSC_TAINTED)
	unsigned int tainted = 0;
#endif
        for (unsigned i = 0; i < exec->argumentCount(); ++i) {
            JSValue v = exec->argument(i);
#if defined(JSC_TAINTED)
            if (LIKELY(v.isString())) {
	        if (asString(v)->isTainted()) {
			tainted = asString(v)->isTainted();
		}
                ropeBuilder.append(asString(v));
 	    } else {
	        if (v.toString(exec).isTainted()) {
			tainted = v.toString(exec).isTainted();
		}
                ropeBuilder.append(v.toString(exec));
	    }
#else
            if (LIKELY(v.isString()))
                ropeBuilder.append(asString(v));
            else
                ropeBuilder.append(v.toString(exec));
#endif

            unsigned newLength = ropeBuilder.length();
            if (newLength < length)
                overflow = true;
            length = newLength;
        }

        if (overflow)
            return throwOutOfMemoryError(exec);

        JSGlobalData* globalData = &exec->globalData();
#if defined(JSC_TAINTED)
#if defined(JSC_TAINTED_DEBUG)
// this block of code explain why there is no need to have tainted check in the following call
// JSString(JSGlobalData* globalData, PassRefPtr<RopeImpl> rope)
#endif
	JSString* s = new (globalData) JSString(globalData, ropeBuilder.release());
	if (tainted) {
		s->setTainted(tainted); 
	} else {
		s->setTainted(0);
	}

	if (tainted) {
		TaintedStructure trace_struct;
		trace_struct.taintedno = tainted;
		trace_struct.internalfunc = "jsString";
		trace_struct.jsfunc = "String.operations.5";
		trace_struct.action = "propagate";
	        trace_struct.value = TaintedUtils::UString2string(s->string());

		TaintedTrace* trace = TaintedTrace::getInstance();
		trace->addTaintedTrace(trace_struct);
    	}

  	return s;
#else
        return new (globalData) JSString(globalData, ropeBuilder.release());
#endif
    }

    // ECMA 11.9.3
    inline bool JSValue::equal(ExecState* exec, JSValue v1, JSValue v2)
    {
        if (v1.isInt32() && v2.isInt32())
            return v1 == v2;

        return equalSlowCase(exec, v1, v2);
    }

    ALWAYS_INLINE bool JSValue::equalSlowCaseInline(ExecState* exec, JSValue v1, JSValue v2)
    {
        do {
            if (v1.isNumber() && v2.isNumber())
                return v1.uncheckedGetNumber() == v2.uncheckedGetNumber();

            bool s1 = v1.isString();
            bool s2 = v2.isString();
            if (s1 && s2)
                return asString(v1)->value(exec) == asString(v2)->value(exec);

            if (v1.isUndefinedOrNull()) {
                if (v2.isUndefinedOrNull())
                    return true;
                if (!v2.isCell())
                    return false;
                return v2.asCell()->structure()->typeInfo().masqueradesAsUndefined();
            }

            if (v2.isUndefinedOrNull()) {
                if (!v1.isCell())
                    return false;
                return v1.asCell()->structure()->typeInfo().masqueradesAsUndefined();
            }

            if (v1.isObject()) {
                if (v2.isObject())
                    return v1 == v2;
                JSValue p1 = v1.toPrimitive(exec);
                if (exec->hadException())
                    return false;
                v1 = p1;
                if (v1.isInt32() && v2.isInt32())
                    return v1 == v2;
                continue;
            }

            if (v2.isObject()) {
                JSValue p2 = v2.toPrimitive(exec);
                if (exec->hadException())
                    return false;
                v2 = p2;
                if (v1.isInt32() && v2.isInt32())
                    return v1 == v2;
                continue;
            }

            if (s1 || s2) {
                double d1 = v1.toNumber(exec);
                double d2 = v2.toNumber(exec);
                return d1 == d2;
            }

            if (v1.isBoolean()) {
                if (v2.isNumber())
                    return static_cast<double>(v1.getBoolean()) == v2.uncheckedGetNumber();
            } else if (v2.isBoolean()) {
                if (v1.isNumber())
                    return v1.uncheckedGetNumber() == static_cast<double>(v2.getBoolean());
            }

            return v1 == v2;
        } while (true);
    }

    // ECMA 11.9.3
    ALWAYS_INLINE bool JSValue::strictEqualSlowCaseInline(ExecState* exec, JSValue v1, JSValue v2)
    {
        ASSERT(v1.isCell() && v2.isCell());

        if (v1.asCell()->isString() && v2.asCell()->isString())
            return asString(v1)->value(exec) == asString(v2)->value(exec);

        return v1 == v2;
    }

    inline bool JSValue::strictEqual(ExecState* exec, JSValue v1, JSValue v2)
    {
        if (v1.isInt32() && v2.isInt32())
            return v1 == v2;

        if (v1.isNumber() && v2.isNumber())
            return v1.uncheckedGetNumber() == v2.uncheckedGetNumber();

        if (!v1.isCell() || !v2.isCell())
            return v1 == v2;

        return strictEqualSlowCaseInline(exec, v1, v2);
    }

    ALWAYS_INLINE bool jsLess(CallFrame* callFrame, JSValue v1, JSValue v2)
    {
        if (v1.isInt32() && v2.isInt32())
            return v1.asInt32() < v2.asInt32();

        double n1;
        double n2;
        if (v1.getNumber(n1) && v2.getNumber(n2))
            return n1 < n2;

        JSGlobalData* globalData = &callFrame->globalData();
        if (isJSString(globalData, v1) && isJSString(globalData, v2))
            return asString(v1)->value(callFrame) < asString(v2)->value(callFrame);

        JSValue p1;
        JSValue p2;
        bool wasNotString1 = v1.getPrimitiveNumber(callFrame, n1, p1);
        bool wasNotString2 = v2.getPrimitiveNumber(callFrame, n2, p2);

        if (wasNotString1 | wasNotString2)
            return n1 < n2;

        return asString(p1)->value(callFrame) < asString(p2)->value(callFrame);
    }

    inline bool jsLessEq(CallFrame* callFrame, JSValue v1, JSValue v2)
    {
        if (v1.isInt32() && v2.isInt32())
            return v1.asInt32() <= v2.asInt32();

        double n1;
        double n2;
        if (v1.getNumber(n1) && v2.getNumber(n2))
            return n1 <= n2;

        JSGlobalData* globalData = &callFrame->globalData();
        if (isJSString(globalData, v1) && isJSString(globalData, v2))
            return !(asString(v2)->value(callFrame) < asString(v1)->value(callFrame));

        JSValue p1;
        JSValue p2;
        bool wasNotString1 = v1.getPrimitiveNumber(callFrame, n1, p1);
        bool wasNotString2 = v2.getPrimitiveNumber(callFrame, n2, p2);

        if (wasNotString1 | wasNotString2)
            return n1 <= n2;

        return !(asString(p2)->value(callFrame) < asString(p1)->value(callFrame));
    }

    // Fast-path choices here are based on frequency data from SunSpider:
    //    <times> Add case: <t1> <t2>
    //    ---------------------------
    //    5626160 Add case: 3 3 (of these, 3637690 are for immediate values)
    //    247412  Add case: 5 5
    //    20900   Add case: 5 6
    //    13962   Add case: 5 3
    //    4000    Add case: 3 5

    ALWAYS_INLINE JSValue jsAdd(CallFrame* callFrame, JSValue v1, JSValue v2)
    {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsAdd(CallFrame* callFrame, JSValue v1, JSValue v2)" << std::endl;
#endif

        double left = 0.0, right;
        if (v1.getNumber(left) && v2.getNumber(right))
            return jsNumber(left + right);
        
        if (v1.isString()) {
#if defined(JSC_TAINTED_DEBUG)
std::cerr << "jsAdd(CallFrame* callFrame, JSValue v1, JSValue v2):" << v1.isString() << ":" << v2.isString() << std::endl;
#endif
            return v2.isString()
                ? jsString(callFrame, asString(v1), asString(v2))
                : jsString(callFrame, asString(v1), v2.toPrimitiveString(callFrame));
        }

        // All other cases are pretty uncommon
        return jsAddSlowCase(callFrame, v1, v2);
    }

    inline size_t normalizePrototypeChain(CallFrame* callFrame, JSValue base, JSValue slotBase, const Identifier& propertyName, size_t& slotOffset)
    {
        JSCell* cell = base.asCell();
        size_t count = 0;

        while (slotBase != cell) {
            JSValue v = cell->structure()->prototypeForLookup(callFrame);

            // If we didn't find slotBase in base's prototype chain, then base
            // must be a proxy for another object.

            if (v.isNull())
                return 0;

            cell = v.asCell();

            // Since we're accessing a prototype in a loop, it's a good bet that it
            // should not be treated as a dictionary.
            if (cell->structure()->isDictionary()) {
                asObject(cell)->flattenDictionaryObject(callFrame->globalData());
                if (slotBase == cell)
                    slotOffset = cell->structure()->get(callFrame->globalData(), propertyName); 
            }

            ++count;
        }
        
        ASSERT(count);
        return count;
    }

    inline size_t normalizePrototypeChain(CallFrame* callFrame, JSCell* base)
    {
        size_t count = 0;
        while (1) {
            JSValue v = base->structure()->prototypeForLookup(callFrame);
            if (v.isNull())
                return count;

            base = v.asCell();

            // Since we're accessing a prototype in a loop, it's a good bet that it
            // should not be treated as a dictionary.
            if (base->structure()->isDictionary())
                asObject(base)->flattenDictionaryObject(callFrame->globalData());

            ++count;
        }
    }

    ALWAYS_INLINE JSValue resolveBase(CallFrame* callFrame, Identifier& property, ScopeChainNode* scopeChain, bool isStrictPut)
    {
        ScopeChainIterator iter = scopeChain->begin();
        ScopeChainIterator next = iter;
        ++next;
        ScopeChainIterator end = scopeChain->end();
        ASSERT(iter != end);

        PropertySlot slot;
        JSObject* base;
        while (true) {
            base = iter->get();
            if (next == end) {
                if (isStrictPut && !base->getPropertySlot(callFrame, property, slot))
                    return JSValue();
                return base;
            }
            if (base->getPropertySlot(callFrame, property, slot))
                return base;

            iter = next;
            ++next;
        }

        ASSERT_NOT_REACHED();
        return JSValue();
    }
} // namespace JSC

#endif // Operations_h
