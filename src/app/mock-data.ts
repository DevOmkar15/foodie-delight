import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Restaurant } from './models/restaurant.model';

export class MockData implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    const restaurants: Restaurant[] = [
      {
        id: 1,
        name: 'OMkar',
        description: 'java',
        location: 'pune',
      },
    ];

    return { restaurants };
  }
}
