
import test from 'ava';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const babel = require('babel-core'); // eslint-disable-line import/no-commonjs

function transformFile(path, configuration) {
    return babel.transformFileSync(resolve(__dirname, path), {
        plugins: [
            configuration ? ['../../src/index.js', configuration] : '../../src/index.js',
        ],
    });
}

function read(path) {
    return readFileSync(resolve(__dirname, path), 'utf8');
}

test('basic require with default webpack name', t => {
    const actual = transformFile('fixtures/basic.absolute.js').code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('basic require with es6 webpack config', t => {
    const actual = transformFile('fixtures/basic.absolute.js', {config: './webpack.config.babel.js'}).code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('basic require with the absolute resolve path', t => {
    const actual = transformFile('fixtures/basic.absolute.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('basic require with the relative resolve path', t => {
    const actual = transformFile('fixtures/basic.relative.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/basic.expected.js');
    t.is(actual, expected);
});

test('filename require', t => {
    const actual = transformFile('fixtures/filename.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/filename.expected.js');
    t.is(actual, expected);
});

test('variable assignment', t => {
    const actual = transformFile('fixtures/variables.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/variables.expected.js');
    t.is(actual, expected);
});

test('requiring files from the root', t => {
    const actual = transformFile('fixtures/rootfolder.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/rootfolder.expected.js');
    t.is(actual, expected);
});

test('requiring module from by alternate name', t => {
    const actual = transformFile('fixtures/module.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/module.expected.js');
    t.is(actual, expected);
});

test('using the import syntax', t => {
    const actual = transformFile('fixtures/import.js', {config: './runtime.webpack.config.js'}).code;
    const expected = read('fixtures/import.expected.js');

    t.is(actual, expected);
});

test('dont throw an exception if the config is found', t => {
    t.notThrows(() => transformFile('fixtures/basic.absolute.js', {
        config: "runtime.webpack.config.js",
        findConfig: true,
    }));
});

test('throw an exception when we cant find the config', t => {
    t.throws(() => transformFile('fixtures/basic.absolute.js', {
        config: "DoesNotExist.js",
        findConfig: true,
    }));
});

test('use environment variables for the config path', t => {
    const ORIGINAL_PWD = process.env.PWD;
    process.env.PWD = __dirname;

    const actual = transformFile('fixtures/import.js', {config: '${PWD}/runtime.webpack.config.js'}).code;
    const expected = read('fixtures/import.expected.js');

    t.is(actual, expected);
    process.env.PWD = ORIGINAL_PWD;
});

test('works with extensions', t => {
    const actual = transformFile('fixtures/extensions.js', {config: './extensions.config.js'}).code;
    const expected = read('fixtures/extensions.expected.js');
    t.is(actual, expected);
});
