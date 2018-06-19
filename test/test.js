const {SSRServerPlugin, SSRClientPlugin} = require('..');
const expect = require('chai').expect;

describe('SSRServerPlugin', function () {
    let ssrplugin
    beforeEach(function () {
        ssrplugin = new SSRServerPlugin()
    });

    it('Empty call', function () {
        expect(() => ssrplugin.validate({})).to.throw();
    });

    it('Missing entry,output', function () {
        expect(() => ssrplugin.validate({target: 'node'})).to.throw();
    });

    it('Missing output', function () {
        expect(() => ssrplugin.validate({target: 'node', entry: 'string'})).to.throw();
    });

    it('Validate options', function () {
        expect(() => ssrplugin.validate({
            target: 'node',
            entry: 'string',
            output: {libraryTarget: 'commonjs2'}
        })).to.not.throw();
    });
});

describe('SSRClientPlugin', function () {
    let ssrplugin
    beforeEach(function () {
        ssrplugin = new SSRClientPlugin()
    });

    it('Missing filename', function () {
        expect(() => ssrplugin.validate()).to.throw();
    });

    it('Validate options', function () {
        expect(() => ssrplugin.validate({filename: 'ssr-client-manifest.json'})).to.not.throw();
    });
});