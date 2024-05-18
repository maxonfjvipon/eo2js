<?xml version="1.0" encoding="UTF-8"?>
<!--
The MIT License (MIT)

Copyright (c) 2024 Objectionary.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:eo="https://www.eolang.org" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="to-java" version="2.0">
  <!-- Converts XMIR to JavaScript -->
  <xsl:output encoding="UTF-8" method="xml"/>
  <!-- VARIABLES -->
  <!-- Disclaimer -->
  <xsl:variable name="disclaimer">
    <xsl:text>This file was auto-generated by eo2js, your changes will be discarded on the next build</xsl:text>
  </xsl:variable>
  <!-- Tab -->
  <xsl:variable name="TAB">
    <xsl:text>  </xsl:text>
  </xsl:variable>
  <!-- RHO -->
  <xsl:variable name="RHO">
    <xsl:text>ρ</xsl:text>
  </xsl:variable>
  <!-- PHI -->
  <xsl:variable name="PHI">
    <xsl:text>φ</xsl:text>
  </xsl:variable>
  <!-- FUNCTIONS  -->
  <!-- EOL with tabs -->
  <xsl:function name="eo:eol">
    <xsl:param name="tabs"/>
    <xsl:value-of select="'&#10;'"/>
    <xsl:value-of select="eo:tabs($tabs)"/>
  </xsl:function>
  <!-- Tabs -->
  <xsl:function name="eo:tabs">
    <xsl:param name="n"/>
    <xsl:for-each select="1 to $n">
      <xsl:value-of select="$TAB"/>
    </xsl:for-each>
  </xsl:function>
  <!-- Clean name -->
  <xsl:function name="eo:clean" as="xs:string">
    <xsl:param name="n" as="xs:string"/>
    <xsl:value-of select="replace(replace(replace(replace($n, '_', '__'), '-', '_'), '@', 'φ'), 'α', '_')"/>
  </xsl:function>
  <!-- Concat arguments via _ -->
  <xsl:function name="eo:suffix" as="xs:string">
    <xsl:param name="s1"/>
    <xsl:param name="s2"/>
    <xsl:value-of select="concat(concat($s1, '_'), $s2)"/>
  </xsl:function>
  <!-- Construct valid object name -->
  <xsl:function name="eo:object-name" as="xs:string">
    <xsl:param name="name" as="xs:string"/>
    <xsl:param name="alt" as="xs:string"/>
    <xsl:variable name="parts" select="tokenize($name, '\.')"/>
    <xsl:variable name="p">
      <xsl:for-each select="$parts">
        <xsl:if test="position()!=last()">
          <xsl:value-of select="eo:clean(.)"/>
          <xsl:text>.</xsl:text>
        </xsl:if>
      </xsl:for-each>
    </xsl:variable>
    <xsl:variable name="c">
      <xsl:choose>
        <xsl:when test="$parts[last()]">
          <xsl:value-of select="$parts[last()]"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$parts"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="pre" select="concat($p, eo:clean($c))"/>
    <xsl:choose>
      <xsl:when test="string-length($pre)&gt;250">
        <xsl:value-of select="concat(substring($pre, 1, 25), $alt)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$pre"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
  <!-- Return valid name of the attribute -->
  <xsl:function name="eo:attr-name" as="xs:string">
    <xsl:param name="attr" as="xs:string"/>
    <xsl:choose>
      <xsl:when test="$attr='@'">
        <xsl:value-of select="$PHI"/>
      </xsl:when>
      <xsl:when test="$attr='^'">
        <xsl:value-of select="$RHO"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat('', $attr)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
  <!-- Fetch object -->
  <xsl:function name="eo:fetch">
    <xsl:param name="object"/>
    <xsl:variable name="parts" select="tokenize($object, '\.')"/>
    <xsl:text>phi</xsl:text>
    <xsl:for-each select="$parts">
      <xsl:text>.take('</xsl:text>
      <xsl:value-of select="."/>
      <xsl:text>')</xsl:text>
    </xsl:for-each>
  </xsl:function>
  <!-- TEMPLATES -->
  <xsl:template match="objects">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:for-each select="object">
        <xsl:copy>
          <xsl:apply-templates select="@*"/>
          <xsl:element name="javascript">
            <xsl:if test="position()=1">
              <xsl:apply-templates select="/program" mode="license"/>
              <xsl:apply-templates select="/program" mode="imports"/>
              <xsl:apply-templates select="//object[@atom]" mode="atom-imports"/>
            </xsl:if>
            <!-- <xsl:apply-templates select="//meta[head='junit' or head='tests']" mode="head"/>-->
            <xsl:apply-templates select="." mode="body"/>
          </xsl:element>
        </xsl:copy>
      </xsl:for-each>
    </xsl:copy>
  </xsl:template>
  <!-- Object name -->
  <xsl:template match="object/@name">
    <xsl:attribute name="name">
      <xsl:value-of select="."/>
    </xsl:attribute>
    <xsl:attribute name="js-name">
      <xsl:variable name="pkg" select="//metas/meta[head='package']/part[1]"/>
      <xsl:if test="$pkg">
        <xsl:value-of select="eo:object-name($pkg, eo:suffix(../@line, ../@pos))"/>
        <xsl:text>.</xsl:text>
      </xsl:if>
      <xsl:value-of select="eo:object-name(., eo:suffix(../@line, ../@pos))"/>
    </xsl:attribute>
  </xsl:template>
  <!-- Object body -->
  <xsl:template match="object" mode="body">
    <xsl:apply-templates select="xmir"/>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const </xsl:text>
    <xsl:value-of select="eo:object-name(@name, eo:suffix(@line, @pos))"/>
    <xsl:text> = function() {</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:apply-templates select="." mode="ctor"/>
    <!--    <xsl:if test="//meta[head='junit' or head='tests'] and not(@parent)">-->
    <!--      <xsl:apply-templates select="." mode="tests"/>-->
    <!--    </xsl:if>-->
    <xsl:apply-templates select="object" mode="body"/>
    <xsl:text>}</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
  </xsl:template>
  <!-- XMIR as comment -->
  <xsl:template match="xmir">
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:for-each select="tokenize(text(), '&#10;')">
      <xsl:value-of select="eo:eol(0)"/>
      <xsl:text>//</xsl:text>
      <xsl:value-of select="."/>
    </xsl:for-each>
  </xsl:template>
  <!-- OBJECT CONSTRUCTING -->
  <xsl:template match="object" mode="ctor">
    <xsl:value-of select="eo:tabs(1)"/>
    <xsl:text>const obj = object('</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>')</xsl:text>
    <!--    <xsl:value-of select="eo:eol(1)"/>-->
    <!--    <xsl:choose>-->
    <!--      <xsl:when test="//meta[head='junit' or head='tests'] and not(@parent)">-->
    <!--        <xsl:text>public </xsl:text>-->
    <!--        <xsl:value-of select="eo:object-name(@name, eo:suffix(@line, @pos))"/>-->
    <!--        <xsl:text>() {</xsl:text>-->
    <!--      </xsl:when>-->
    <!--      <xsl:when test="@ancestors">-->
    <!--        <xsl:text>public </xsl:text>-->
    <!--        <xsl:value-of select="eo:object-name(@name, eo:suffix(@line, @pos))"/>-->
    <!--        <xsl:text>(final Phi sigma) {</xsl:text>-->
    <!--        <xsl:value-of select="eo:eol(2)"/>-->
    <!--        <xsl:text>super(sigma);</xsl:text>-->
    <!--      </xsl:when>-->
    <!--      <xsl:otherwise>-->
    <!--        <xsl:text>public </xsl:text>-->
    <!--        <xsl:value-of select="eo:object-name(@name, eo:suffix(@line, @pos))"/>-->
    <!--        <xsl:text>(final Phi sigma) {</xsl:text>-->
    <!--        <xsl:value-of select="eo:eol(2)"/>-->
    <!--        <xsl:text>super(sigma);</xsl:text>-->
    <!--      </xsl:otherwise>-->
    <!--    </xsl:choose>-->
    <xsl:apply-templates select="attr">
      <xsl:with-param name="object" select="."/>
      <xsl:with-param name="indent">
        <xsl:value-of select="eo:tabs(2)"/>
      </xsl:with-param>
    </xsl:apply-templates>
    <xsl:value-of select="eo:eol(1)"/>
    <xsl:text>return obj</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
  </xsl:template>
  <!-- Attribute -->
  <xsl:template match="attr">
    <xsl:value-of select="eo:eol(1)"/>
    <xsl:text>obj.attrs['</xsl:text>
    <xsl:value-of select="eo:attr-name(@name)"/>
    <xsl:text>'] = </xsl:text>
    <xsl:apply-templates select="*">
      <xsl:with-param name="name" select="eo:attr-name(@name)"/>
    </xsl:apply-templates>
  </xsl:template>
  <!-- Void attribute -->
  <xsl:template match="void">
    <xsl:param name="name"/>
    <xsl:text>attr.void('</xsl:text>
    <xsl:value-of select="$name"/>
    <xsl:text>')</xsl:text>
  </xsl:template>
  <!-- Bound attribute -->
  <xsl:template match="bound">
    <xsl:text>attr.once(</xsl:text>
    <xsl:value-of select="eo:eol(2)"/>
    <xsl:text>attr.lambda(</xsl:text>
    <xsl:value-of select="eo:eol(3)"/>
    <xsl:text>obj, function(rho) {</xsl:text>
    <xsl:apply-templates select="*">
      <xsl:with-param name="name" select="'ret'"/>
      <xsl:with-param name="indent" select="4"/>
    </xsl:apply-templates>
    <xsl:value-of select="eo:eol(4)"/>
    <xsl:text>return ret</xsl:text>
    <xsl:value-of select="eo:eol(3)"/>
    <xsl:text>}</xsl:text>
    <xsl:value-of select="eo:eol(2)"/>
    <xsl:text>)</xsl:text>
    <xsl:value-of select="eo:eol(1)"/>
    <xsl:text>)</xsl:text>
  </xsl:template>
  <!--  <xsl:template match="o[not(@base) and @name]">-->
  <!--    <xsl:text>/</xsl:text>-->
  <!--    <xsl:text>* default */</xsl:text>-->
  <!--  </xsl:template>-->
  <!--  <xsl:template match="o[not(@base) and not(@name)]">-->
  <!--    <xsl:param name="indent"/>-->
  <!--    <xsl:param name="name" select="'o'"/>-->
  <!--    <xsl:value-of select="$indent"/>-->
  <!--    <xsl:text>Phi </xsl:text>-->
  <!--    <xsl:value-of select="$name"/>-->
  <!--    <xsl:text> = </xsl:text>-->
  <!--    <xsl:text>new PhDefault() { </xsl:text>-->
  <!--    <xsl:text>/</xsl:text>-->
  <!--    <xsl:text>* anonymous abstract object without attributes */ };</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--  </xsl:template>-->
  <!-- Based, not method -->
  <xsl:template match="o[@base and not(starts-with(@base, '.'))]">
    <xsl:param name="name"/>
    <xsl:param name="indent"/>
    <xsl:variable name="current" select="."/>
    <xsl:variable name="source" select="//*[generate-id()!=generate-id($current) and @name=$current/@base and @line=$current/@ref]"/>
    <!-- Terminate -->
    <xsl:if test="count($source) &gt; 1">
      <xsl:message terminate="yes">
        <xsl:text>Found more than one target of '</xsl:text>
        <xsl:value-of select="$current/@base"/>
        <xsl:text>' at the line #</xsl:text>
        <xsl:value-of select="$current/@line"/>
        <xsl:text>leading to</xsl:text>
        <xsl:for-each select="$source">
          <xsl:if test="position()&gt;1">
            <xsl:text>,</xsl:text>
          </xsl:if>
          <xsl:text>&lt;</xsl:text>
          <xsl:value-of select="name(.)"/>
          <xsl:text>/&gt;</xsl:text>
          <xsl:text>at line #</xsl:text>
          <xsl:value-of select="@line"/>
        </xsl:for-each>
        <xsl:text>; it's an internal bug</xsl:text>
      </xsl:message>
    </xsl:if>
    <xsl:value-of select="eo:eol($indent)"/>
    <xsl:text>let </xsl:text>
    <xsl:value-of select="$name"/>
    <xsl:text> = </xsl:text>
    <xsl:choose>
      <xsl:when test="@primitive and @base">
        <xsl:value-of select="eo:fetch(@base)"/>
      </xsl:when>
      <xsl:when test="@base='$'">
        <xsl:text>rho</xsl:text>
      </xsl:when>
      <xsl:when test="@base='Q'">
        <xsl:text>phi</xsl:text>
      </xsl:when>
      <xsl:when test="@base='^'">
        <xsl:text>taken(rho, '</xsl:text>
        <xsl:value-of select="$RHO"/>
        <xsl:text>')</xsl:text>
      </xsl:when>
      <xsl:when test="$source/@ancestors">
        <xsl:value-of select="eo:object-name($source/@name, eo:suffix(@line, @pos))"/>
        <xsl:text>(rho)</xsl:text>
      </xsl:when>
      <xsl:when test="$source and name($source)='object'">
        <xsl:value-of select="eo:fetch(concat($source/@package, '.', $source/@name))"/>
      </xsl:when>
      <xsl:when test="$source/@level">
        <xsl:for-each select="0 to $source/@level">
          <xsl:text>taken(</xsl:text>
        </xsl:for-each>
        <xsl:text>rho</xsl:text>
        <xsl:for-each select="1 to $source/@level">
          <xsl:text>, '</xsl:text>
          <xsl:value-of select="$RHO"/>
          <xsl:text>')</xsl:text>
        </xsl:for-each>
        <xsl:text>, '</xsl:text>
        <xsl:value-of select="$source/@name"/>
        <xsl:text>')</xsl:text>
      </xsl:when>
      <xsl:when test="$source">
        <xsl:text>taken(rho, '</xsl:text>
        <xsl:value-of select="eo:attr-name(@base)"/>
        <xsl:text>')</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="eo:fetch(@base)"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:apply-templates select="." mode="application">
      <xsl:with-param name="name" select="$name"/>
      <xsl:with-param name="indent" select="$indent"/>
    </xsl:apply-templates>
    <xsl:apply-templates select=".[@copy]" mode="copy">
      <xsl:with-param name="name" select="$name"/>
      <xsl:with-param name="indent" select="$indent"/>
    </xsl:apply-templates>
    <!--    <xsl:apply-templates select="." mode="located">-->
    <!--      <xsl:with-param name="name" select="$name"/>-->
    <!--      <xsl:with-param name="indent" select="$indent"/>-->
    <!--    </xsl:apply-templates>-->
  </xsl:template>
  <!-- Based, method, starts with . -->
  <xsl:template match="o[starts-with(@base, '.') and *]">
    <xsl:param name="indent"/>
    <xsl:param name="name"/>
    <xsl:apply-templates select="*[1]">
      <xsl:with-param name="name">
        <xsl:value-of select="$name"/>
        <xsl:text>_base</xsl:text>
      </xsl:with-param>
      <xsl:with-param name="indent" select="$indent"/>
    </xsl:apply-templates>
    <xsl:value-of select="eo:eol($indent)"/>
    <xsl:text>let </xsl:text>
    <xsl:value-of select="$name"/>
    <xsl:text> = taken(</xsl:text>
    <xsl:value-of select="$name"/>
    <xsl:text>_base, '</xsl:text>
    <xsl:variable name="method" select="substring-after(@base, '.')"/>
    <xsl:choose>
      <xsl:when test="$method='^'">
        <xsl:value-of select="$RHO"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="eo:attr-name($method)"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>')</xsl:text>
    <!--    <xsl:apply-templates select="." mode="located">-->
    <!--      <xsl:with-param name="name" select="$name"/>-->
    <!--      <xsl:with-param name="indent" select="$indent"/>-->
    <!--    </xsl:apply-templates>-->
    <xsl:apply-templates select="." mode="application">
      <xsl:with-param name="name" select="$name"/>
      <xsl:with-param name="indent" select="$indent"/>
      <xsl:with-param name="skip" select="1"/>
    </xsl:apply-templates>
  </xsl:template>
  <!--  <xsl:template match="*" mode="located">-->
  <!--    <xsl:param name="indent"/>-->
  <!--    <xsl:param name="name" select="'o'"/>-->
  <!--    <xsl:if test="@line and @pos">-->
  <!--      <xsl:value-of select="$indent"/>-->
  <!--      <xsl:value-of select="eo:tabs(1)"/>-->
  <!--      <xsl:value-of select="$name"/>-->
  <!--      <xsl:text> = new PhLocated(</xsl:text>-->
  <!--      <xsl:value-of select="$name"/>-->
  <!--      <xsl:text>, </xsl:text>-->
  <!--      <xsl:value-of select="@line"/>-->
  <!--      <xsl:text>, </xsl:text>-->
  <!--      <xsl:value-of select="@pos"/>-->
  <!--      <xsl:text>, </xsl:text>-->
  <!--      <xsl:text>"</xsl:text>-->
  <!--      <xsl:value-of select="@loc"/>-->
  <!--      <xsl:text>"</xsl:text>-->
  <!--      <xsl:text>);</xsl:text>-->
  <!--      <xsl:value-of select="eo:eol(0)"/>-->
  <!--    </xsl:if>-->
  <!--  </xsl:template>-->
  <!-- APPLICATION  -->
  <xsl:template match="*" mode="application">
    <xsl:param name="indent"/>
    <xsl:param name="name"/>
    <xsl:param name="skip" select="0"/>
    <!-- CREATE OBJECTS TO PUT -->
    <xsl:for-each select="./*[name()!='value' and position()&gt;$skip][not(@level)]">
      <!-- VARIABLE TO PUT -->
      <xsl:variable name="put">
        <xsl:value-of select="$name"/>
        <xsl:text>_</xsl:text>
        <xsl:value-of select="position()"/>
      </xsl:variable>
      <!-- FETCH NEXT OBJECT -->
      <xsl:apply-templates select=".">
        <xsl:with-param name="name" select="$put"/>
        <xsl:with-param name="indent" select="$indent+1"/>
      </xsl:apply-templates>
    </xsl:for-each>
    <!-- PUT OBJECTS -->
    <xsl:variable name="to_put" select="./*[name()!='value' and position() &gt; $skip][not(@level)]"/>
    <xsl:if test="count($to_put)&gt;0">
      <xsl:value-of select="eo:eol($indent)"/>
      <xsl:value-of select="$name"/>
      <xsl:text> = applied(</xsl:text>
      <xsl:value-of select="$name"/>
      <xsl:text>, {</xsl:text>
      <xsl:value-of select="eo:eol($indent+1)"/>
      <xsl:for-each select="$to_put">
        <xsl:choose>
          <xsl:when test="@as">
            <xsl:choose>
              <xsl:when test="matches(@as,'^[0-9]+$')">
                <xsl:value-of select="eo:attr-name(@as)"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:text>'</xsl:text>
                <xsl:value-of select="eo:attr-name(@as)"/>
                <xsl:text>'</xsl:text>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="position()-1"/>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:text>: </xsl:text>
        <xsl:value-of select="$name"/>
        <xsl:text>_</xsl:text>
        <xsl:value-of select="position()"/>
        <xsl:choose>
          <xsl:when test="position()=last()">
            <xsl:value-of select="eo:eol($indent)"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text>,</xsl:text>
            <xsl:value-of select="eo:eol($indent+1)"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
      <xsl:text>})</xsl:text>
    </xsl:if>
    <xsl:apply-templates select="value">
      <xsl:with-param name="name" select="$name"/>
      <xsl:with-param name="indent" select="$indent"/>
    </xsl:apply-templates>
  </xsl:template>
  <!-- VALUE TO PUT  -->
  <xsl:template match="value">
    <xsl:param name="indent"/>
    <xsl:param name="name"/>
    <xsl:value-of select="eo:eol($indent)"/>
    <xsl:value-of select="$name"/>
    <xsl:text>.assets['Δ'] = </xsl:text>
    <xsl:value-of select="text()"/>
  </xsl:template>
  <!--  <xsl:template match="class" mode="tests">-->
  <!--    <xsl:value-of select="eo:eol(1)"/>-->
  <!--    <xsl:text>@Test</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(1)"/>-->
  <!--    <xsl:text>public void works() throws java.lang.Exception {</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2)"/>-->
  <!--    <xsl:choose>-->
  <!--      <xsl:when test="starts-with(@name, 'throws')">-->
  <!--        <xsl:text>Assertions.assertThrows(Exception.class, () -&gt; {</xsl:text>-->
  <!--        <xsl:value-of select="eo:eol(2)"/>-->
  <!--        <xsl:apply-templates select="." mode="assert">-->
  <!--          <xsl:with-param name="indent" select="1"/>-->
  <!--        </xsl:apply-templates>-->
  <!--        <xsl:value-of select="eo:eol(2)"/>-->
  <!--        <xsl:text>});</xsl:text>-->
  <!--      </xsl:when>-->
  <!--      <xsl:otherwise>-->
  <!--        <xsl:apply-templates select="." mode="assert">-->
  <!--          <xsl:with-param name="indent" select="0"/>-->
  <!--        </xsl:apply-templates>-->
  <!--      </xsl:otherwise>-->
  <!--    </xsl:choose>-->
  <!--    <xsl:value-of select="eo:eol(1)"/>-->
  <!--    <xsl:text>}</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--  </xsl:template>-->
  <!--  <xsl:template match="class" mode="assert">-->
  <!--    <xsl:param name="indent"/>-->
  <!--    <xsl:value-of select="eo:tabs($indent)"/>-->
  <!--    <xsl:text>Object obj = new Dataized(new </xsl:text>-->
  <!--    <xsl:value-of select="eo:object-name(@name, eo:suffix(@line, @pos))"/>-->
  <!--    <xsl:text>()).take(Boolean.class);</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2 + $indent)"/>-->
  <!--    <xsl:text>if (obj instanceof String) {</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2 + $indent)"/>-->
  <!--    <xsl:text>  Assertions.fail(obj.toString());</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2 + $indent)"/>-->
  <!--    <xsl:text>} else {</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2 + $indent)"/>-->
  <!--    <xsl:text>  Assertions.assertTrue((Boolean) obj);</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(2 + $indent)"/>-->
  <!--    <xsl:text>}</xsl:text>-->
  <!--  </xsl:template>-->
  <!--  <xsl:template match="meta[head='package']" mode="head">-->
  <!--    <xsl:text>package </xsl:text>-->
  <!--    <xsl:value-of select="eo:object-name(tail, '')"/>-->
  <!--    <xsl:text>;</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--  </xsl:template>-->
  <!--  <xsl:template match="meta[head='junit' or head='tests']" mode="head">-->
  <!--    <xsl:text>import org.junit.jupiter.api.Assertions;</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--    <xsl:text>import org.junit.jupiter.api.Test;</xsl:text>-->
  <!--    <xsl:value-of select="eo:eol(0)"/>-->
  <!--  </xsl:template>-->
  <!-- Disclaimer -->
  <xsl:template match="/program" mode="license">
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>/* </xsl:text>
    <xsl:value-of select="$disclaimer"/>
    <xsl:text> */</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
  </xsl:template>
  <!-- Imports -->
  <xsl:template match="/program" mode="imports">
    <xsl:text>const attr = require('eo2js-runtime/src/runtime/attribute/attr')</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const object = require('eo2js-runtime/src/runtime/object')</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const phi = require('eo2js-runtime/src/runtime/phi')</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const taken = require('eo2js-runtime/src/runtime/taken')</xsl:text>
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const applied = require('eo2js-runtime/src/runtime/applied')</xsl:text>
  </xsl:template>
  <!-- Atom imports -->
  <xsl:template match="object" mode="atom-imports">
    <xsl:value-of select="eo:eol(0)"/>
    <xsl:text>const </xsl:text>
    <xsl:value-of select="./@name"/>
    <xsl:text> = require('eo2js-runtime/src/objects/</xsl:text>
    <xsl:value-of select="replace(@package, '\.', '/')"/>
    <xsl:text>/</xsl:text>
    <xsl:value-of select="@name"/>
    <xsl:text>')</xsl:text>
  </xsl:template>
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
