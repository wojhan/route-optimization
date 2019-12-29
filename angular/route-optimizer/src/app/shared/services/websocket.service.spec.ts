import { TestBed } from '@angular/core/testing';

import { WebSocketServiceService } from './websocket.service';

describe('WebSocketServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketServiceService = TestBed.get(WebSocketServiceService);
    expect(service).toBeTruthy();
  });
});
