const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

const sandbox = sinon.createSandbox();

const validation = require('../validation');

describe('User validation', () =>{
  let req = {};
  let res = {};
  let next;

  context('createTask', () => {
    beforeEach(() => {
      sandbox.reset();

      req = {
        body: {
          email: 'test@test.com',
          password: 'testPass',
        }
      };

      res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub(),
      };

      next = sandbox.spy();
    });

    it('Every thing is ok', () => {
      validation.registration(req, res, next);
      
      expect(next.calledOnce).to.be.true;
    });

    it('Should get error for empty body', () => {
      req.body = {};

      const errors =  [
          '"email" is required',
          '"password" is required',
        ];


      validation.registration(req, res, next);

      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.false;

      expect(res.json.firstCall.args[0]).to.deep.equal({errors});
    });
  });
});
