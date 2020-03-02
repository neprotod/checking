const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const validation = require('../validation');

describe('Task validation', () =>{
  let req = {};
  let res = {};
  let next;

  context('createTask', () => {
    beforeEach(() => {
      sandbox.reset();

      req = {
        body: {
          role: '5e58630fcc43153d36d0aec1',
          priority: '5e58630fcc43153d36d0aec1',
          title: 'testString',
          description: 'testString',
          start_date: 'testString',
          end_date: 'testString',
          done: false,
        }
      };

      res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub(),
      };

      next = sandbox.spy();
    });

    it('Every thing is ok', () => {
      validation.createTask(req, res, next);

      expect(next.calledOnce).to.be.true;
    });

    it('Should get error for empty body', () => {
      req.body = {};

      const errors =  [
          '"role" is required',
          '"priority" is required',
          '"title" is required',
          '"description" is required',
          '"start_date" is required',
          '"end_date" is required',
          '"done" is required'
        ];


      validation.createTask(req, res, next);

      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.false;

      expect(res.json.firstCall.args[0]).to.deep.equal({errors});
    });

    it('Should get error for string role and priority', () => {
      req.body.role = 'string';
      req.body.priority = 'string';

      const errors = [
        '"role" with value "string" fails to match the valid mongo id pattern',
        '"priority" with value "string" fails to match the valid mongo id pattern'
      ];


      validation.createTask(req, res, next);

      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.false;

      expect(res.json.firstCall.args[0]).to.deep.equal({errors});
    });
  });
});
