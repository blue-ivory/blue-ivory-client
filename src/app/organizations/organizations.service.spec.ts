/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationsService]
    });
  });

  it('should ...', inject([OrganizationsService], (service: OrganizationsService) => {
    expect(service).toBeTruthy();
  }));
});
