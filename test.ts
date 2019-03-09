import * as fs  from 'fs';
import MatcherCollection = require('./');

const tap = require('tap');
const test = tap.test;
const Minimatch = require('minimatch').Minimatch;

test('Shape', function(t: any) {
  const x = new MatcherCollection([]);

  t.ok(typeof x.match === 'function');
  t.ok(typeof x.mayContain === 'function');
  t.done();
});

tap.Test.prototype.addAssert('mayContain', 2, function(this:any, path: string, matcher: string[]) {
  this.assert(new MatcherCollection(matcher).mayContain(path),
              'expected: `' + path + '` to match: `' + matcher + '`');
});

tap.Test.prototype.addAssert('mayNotContain', 2, function(this:any, path: string, matcher: string[]) {
  this.assert(!new MatcherCollection(matcher).mayContain(path),
              'expected to NOT: `' + path + '` to match: `' + matcher + '`');
});

test('MatcherCollection#mayContain', function(t: any) {
  t.mayContain('dir/bar.txt',       ['dir/bar.txt']);
  t.mayNotContain('dir/bar.foo',    ['dir/bar.txt']);
  t.mayContain('dir/bar.foo',       ['dir/bar.{txt,foo}']);
  t.mayContain('dir/bar.txt',       ['dir/bar.{txt,foo}']);
  t.mayContain('dir/',              ['dir/bar.txt']);
  t.mayContain('dir/',              ['dir/bar.{txt,foo}']);
  t.mayContain('dir/',              ['dir/bar.{foo,txt}']);
  t.mayContain('dir/',              ['{dir,bar}']);
  t.mayContain('dir/',              ['{bar,dir}/foo']);
  t.mayNotContain('dir/',           ['{bar}']);
  t.mayNotContain('bar',            ['baz']);
  t.mayNotContain('dir/subdir',     ['dir/bar.txt']);
  t.mayNotContain('dir/zzz.txt',    ['dir/bar.txt']);
  t.mayNotContain('foo.txt',        ['dir/bar.txt']);
  t.mayNotContain('some-other-dir', ['dir/bar.txt']);
  t.mayNotContain('symlink1',       ['dir/bar.txt']);
  t.mayNotContain('symlink2',       ['dir/bar.txt']);
  t.mayNotContain('foo.txt',        ['dir/bar.txt']);
  t.mayContain('foo/baz',           ['foo/baz/bar/{buz,quz}']);
  t.mayContain('foo/baz',           ['foo/{bar,baz}/bar/{buz,quz}']);
  t.mayNotContain('foo/baz/quz',    ['foo/{bar,baz}/bar/{buz,quz}']);
  t.mayContain('foo/baz',           ['foo/{bar,baz}/bar/{buz,quz}']);

  t.mayContain('foo/bar', [new Minimatch('foo/bar')]);

  t.end();
});

// this can be consolidated if AppVeyor is added
test('MatcherCollection#mayContain Windows', function(t: any) {
  t.mayContain('dir\\bar.txt',       ['dir/bar.txt']);
  t.mayNotContain('dir\\bar.foo',    ['dir/bar.txt']);
  t.mayContain('dir\\bar.foo',       ['dir/bar.{txt,foo}']);
  t.mayContain('dir\\bar.txt',       ['dir/bar.{txt,foo}']);
  t.mayContain('dir\\',              ['dir/bar.txt']);
  t.mayContain('dir\\',              ['dir/bar.{txt,foo}']);
  t.mayContain('dir\\',              ['dir/bar.{foo,txt}']);
  t.mayContain('dir\\',              ['{dir,bar}']);
  t.mayContain('dir\\',              ['{bar,dir}/foo']);
  t.mayNotContain('dir\\',           ['{bar}']);
  t.mayNotContain('bar',            ['baz']);
  t.mayNotContain('dir\\subdir',     ['dir/bar.txt']);
  t.mayNotContain('dir\\zzz.txt',    ['dir/bar.txt']);
  t.mayNotContain('foo.txt',        ['dir/bar.txt']);
  t.mayNotContain('some-other-dir', ['dir/bar.txt']);
  t.mayNotContain('symlink1',       ['dir/bar.txt']);
  t.mayNotContain('symlink2',       ['dir/bar.txt']);
  t.mayNotContain('foo.txt',        ['dir/bar.txt']);
  t.mayContain('foo\\baz',           ['foo/baz/bar/{buz,quz}']);
  t.mayContain('foo\\baz',           ['foo/{bar,baz}/bar/{buz,quz}']);
  t.mayNotContain('foo\\baz\\quz',    ['foo/{bar,baz}/bar/{buz,quz}']);
  t.mayContain('foo\\baz',           ['foo/{bar,baz}/bar/{buz,quz}']);

  t.mayContain('foo\\bar', [new Minimatch('foo/bar')]);

  t.end();
});
