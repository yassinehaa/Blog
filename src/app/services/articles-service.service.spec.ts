import { TestBed } from '@angular/core/testing';

import { ArticlesServiceService } from './articles-service.service';

describe('ArticlesServiceService', () => {
  let service: ArticlesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
