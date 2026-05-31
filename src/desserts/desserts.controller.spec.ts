import { Test, TestingModule } from '@nestjs/testing';
import { DessertsController } from './desserts.controller';

describe('DessertsController', () => {
  let controller: DessertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DessertsController],
    }).compile();

    controller = module.get<DessertsController>(DessertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
