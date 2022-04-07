import { TestBed } from '@angular/core/testing';

import { FeaturesService } from './features.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('FeaturesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ApolloTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: FeaturesService = TestBed.get(FeaturesService);
    expect(service).toBeTruthy();
  });
});
