import { NgModule } from '@angular/core';
import { StoreFinderStoreModule } from './store/store-finder-store.module';
import { StoreFinderService } from './facade/store-finder.service';
import { StoreDataService } from './facade';
import { GoogleMapRendererService, ExternalJsFileLoader } from './services';
import { WindowRef } from '../window';

@NgModule({
  imports: [StoreFinderStoreModule],
  providers: [
    StoreFinderService,
    StoreDataService,
    GoogleMapRendererService,
    ExternalJsFileLoader,
    WindowRef
  ]
})
export class StoreFinderCoreModule {}
