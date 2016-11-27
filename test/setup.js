const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('supertest');
const mocha = require('mocha');
const coMocha = require('co-mocha');

coMocha(mocha);

global.expect = chai.expect;
global.sinon = sinon;
global.request = request;

chai.should();
chai.use(sinonChai);
