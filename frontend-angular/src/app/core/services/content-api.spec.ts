import { TestBed } from '@angular/core/testing';
import { ContentApi } from './content-api';

describe('ContentApi', () => {
  let service: ContentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
