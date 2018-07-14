import { CabinetModule } from './cabinet.module';

describe('CabinetModule', () => {
  let cabinetModule: CabinetModule;

  beforeEach(() => {
    cabinetModule = new CabinetModule();
  });

  it('should create an instance', () => {
    expect(cabinetModule).toBeTruthy();
  });
});
