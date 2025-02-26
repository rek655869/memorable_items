import { Sheet } from './Sheet.ts';

export class ActualSheet extends Sheet {
  static init(): void {
    super.init('Актуальные');
  }
}

ActualSheet.init();
