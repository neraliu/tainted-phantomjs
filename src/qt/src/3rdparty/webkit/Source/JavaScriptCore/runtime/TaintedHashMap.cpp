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
#include "TaintedHashMap.h"

namespace JSC {

TaintedHashMap* TaintedHashMap::m_tainted_map = NULL;

TaintedHashMap* TaintedHashMap::getInstance() 
{
        if (!m_tainted_map) {
                m_tainted_map = new TaintedHashMap();
        }
        return m_tainted_map;
}

void TaintedHashMap::add(string l, unsigned int t)
{
	m_map.insert(std::pair<string,unsigned int>(l,t));
}

void TaintedHashMap::update(string l, unsigned int t)
{
	m_map[l] = t;
}

void TaintedHashMap::remove(string l)
{
	m_map.erase(l);
}

unsigned int TaintedHashMap::get(string l)
{
	if(m_map.find(l) == m_map.end()) {
		return 0;
	} else {
		return m_map[l];
	}
}

void TaintedHashMap::clear()
{
	m_map.clear();
}

TaintedHashMap::TaintedHashMap()
{
	m_map.clear();
}

TaintedHashMap::~TaintedHashMap()
{
	m_map.clear();
}

} // namespace JSC
