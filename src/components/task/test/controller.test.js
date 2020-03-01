const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

// model db
const TaskModel = require('../model');

const controller = require('../controller');

describe('Task controller', () =>{
  let req = {};
  let res = {};

  beforeEach(async () => {
    sandbox.restore();

    req = {
      body: {},
      session: {
        id_user: '12345',
      },
      params: {
        taskId: '10',
      },
      query: {
        filter: 'something',
      }
    };

    res = {
      status: sandbox.stub().callsFake(() => res),
      json: sandbox.stub(),
    };

    sandbox.stub(console, 'error');
  });

  context('createTask', async () => {
    it('Should be ok', async () => {
      sandbox.stub(TaskModel, 'createTask').returns('good');
      sandbox.stub(TaskModel, 'createUserTask');

      await controller.createTask(req, res);

      // Model starts
      expect(TaskModel.createTask.calledOnce).to.be.true;
      expect(TaskModel.createUserTask.calledOnce).to.be.true;

      // Return result test
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.deep.equal(201);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal('good');
    });

    it('Should be error', async () => {
      sandbox.stub(TaskModel, 'createTask').throws('Some error');
      sandbox.stub(TaskModel, 'createUserTask');

      await controller.createTask(req, res);

      // Model starts
      expect(TaskModel.createTask.calledOnce).to.be.true;
      expect(TaskModel.createUserTask.calledOnce).to.be.false;
      
      // Return result test
      expect(console.error.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;

      expect(res.status.firstCall.args[0]).to.deep.equal(500);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({errors: 'Database error'});
    });
  });

  context('updateTask', async () => {
    it('Should be ok', async () => {
      sandbox.stub(TaskModel, 'updateTask').returns('good');

      await controller.updateTask(req, res);

      // Model starts
      expect(TaskModel.updateTask.calledOnce).to.be.true;

      // Return result test
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.deep.equal(200);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal('good');
    });
    
    it('Should be error', async () => {
      sandbox.stub(TaskModel, 'updateTask').throws('Some error');

      await controller.updateTask(req, res);

      // Model starts
      expect(TaskModel.updateTask.calledOnce).to.be.true;
      
      // Return result test
      expect(console.error.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;

      expect(res.status.firstCall.args[0]).to.deep.equal(500);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({errors: 'Database error'});
    });
  });

  context('getAllPriority', async () => {
    it('Should be ok', async () => {
      sandbox.stub(TaskModel, 'getAllPriority').returns('good');

      await controller.getAllPriority(req, res);

      // Model starts
      expect(TaskModel.getAllPriority.calledOnce).to.be.true;

      // Return result test
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.deep.equal(200);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal('good');
    });
    
    it('Should be error', async () => {
      sandbox.stub(TaskModel, 'getAllPriority').throws('Some error');

      await controller.getAllPriority(req, res);

      // Model starts
      expect(TaskModel.getAllPriority.calledOnce).to.be.true;
      
      // Return result test
      expect(console.error.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;

      expect(res.status.firstCall.args[0]).to.deep.equal(500);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({errors: 'Database error'});
    });
  });

  context('getAllUserTask', async () => {
    it('Should be ok', async () => {
      sandbox.stub(TaskModel, 'getAllUserTask').returns('good');

      await controller.getAllUserTask(req, res);

      // Model starts
      expect(TaskModel.getAllUserTask.calledOnce).to.be.true;

      // Return result test
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.deep.equal(200);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal('good');
    });
    
    it('Should be error', async () => {
      sandbox.stub(TaskModel, 'getAllUserTask').throws('Some error');

      await controller.getAllUserTask(req, res);

      // Model starts
      expect(TaskModel.getAllUserTask.calledOnce).to.be.true;
      
      // Return result test
      expect(console.error.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;

      expect(res.status.firstCall.args[0]).to.deep.equal(500);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({errors: 'Database error'});
    });
  });

  context('getTask', async () => {
    it('Should be ok', async () => {
      sandbox.stub(TaskModel, 'getTask').returns('good');

      await controller.getTask(req, res);

      // Model starts
      expect(TaskModel.getTask.calledOnce).to.be.true;

      // Return result test
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.deep.equal(200);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal('good');
    });
    
    it('Should be error', async () => {
      sandbox.stub(TaskModel, 'getTask').throws('Some error');

      await controller.getTask(req, res);

      // Model starts
      expect(TaskModel.getTask.calledOnce).to.be.true;
      
      // Return result test
      expect(console.error.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;

      expect(res.status.firstCall.args[0]).to.deep.equal(500);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({errors: 'Database error'});
    });
  });
  
});