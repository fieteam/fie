const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('supertest');

global.expect = chai.expect;
global.sinon = sinon;
global.request = request;

chai.should();
chai.use(sinonChai);
