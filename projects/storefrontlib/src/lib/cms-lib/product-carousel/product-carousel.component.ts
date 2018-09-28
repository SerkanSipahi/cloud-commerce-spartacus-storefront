import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnDestroy, <<<<<<< HEAD ViewChild,
  OnInit,
  DoCheck ======= ChangeDetectorRef >>>>>>> develop
} from '@angular/core';
import {Observable, Subscription, Subject, fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {AbstractCmsComponent} from '../../cms/components/abstract-cms-component';
import * as fromProductStore from '../../product/store';
import {Store} from '@ngrx/store';
import * as fromStore from '../../cms/store';
import {CmsService} from '../../cms/facade/cms.service';

@Component({selector: 'y-product-carousel', templateUrl: './product-carousel.component.html', styleUrls: ['./product-carousel.component.scss'], changeDetection: ChangeDetectionStrategy.OnPush})
export class ProductCarouselComponent extends AbstractCmsComponent
implements OnDestroy,
OnInit {
  productGroups : any[];
  itemPerPage;

  products$ : Observable < any[] >;
  private finishSubject = new Subject();
  private firstTime = true;

  resizeSubscription : Subscription;
  codesSubscription : Subscription;

  @ViewChild('carousel')carousel : any;
  @Input()productCodes : Array < String >;

  constructor(protected cmsService : CmsService, protected cd : ChangeDetectorRef, protected store : Store < fromStore.CmsState >) {
    super(cmsService, cd);
  }

  ngOnInit() {
    this.setItemsPerPage();
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(this.setItemsPerPage.bind(this));
  }

  prev() {
    this
      .carousel
      .prev();
  }

  next() {
    this
      .carousel
      .next();
  }

  protected fetchData() {
    const codes = this.getProductCodes();

    if (codes && codes.length > 0) {
      this.codesSubscription = this
        .store
        .select(fromProductStore.getAllProductCodes)
        .pipe(takeUntil(this.finishSubject))
        .subscribe(productCodes => {
          if (this.firstTime || productCodes.length === 0) {
            codes.filter(code => productCodes.indexOf(code) === -1).forEach(code => {
              this
                .store
                .dispatch(new fromProductStore.LoadProduct(code));
            });
          }
        });

      this.firstTime = false;

      this.products$ = this
        .store
        .select(fromProductStore.getSelectedProductsFactory(codes))
        .pipe(tap(this.group.bind(this)));
    }
    super.fetchData();
  }

  private group(products) {
    const groups = [];
    products.forEach(product => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.length < this.itemPerPage) {
        lastGroup.push(product);
      } else {
        groups.push([product]);
      }
    });
    this.productGroups = groups;
    return groups;
  }

  private setItemsPerPage() {
    const {innerWidth} = window;
    if (innerWidth < 576) {
      this.itemPerPage = 1;
    } else if (innerWidth > 576 && innerWidth < 768) {
      this.itemPerPage = 2;
    } else {
      this.itemPerPage = 4;
    }
  }

  getProductCodes() : Array < string > {
    let codes;
    if (this.component && this.component.productCodes) {
      codes = this
        .component
        .productCodes
        .split(' ');
    } else {
      codes = this.productCodes;
    }
    return codes;
  }

  ngOnDestroy() {
    if (this.codesSubscription) {
      this
        .codesSubscription
        .unsubscribe();
    }
    if (this.resizeSubscription) {
      this
        .resizeSubscription
        .unsubscribe();
    }
    this
      .finishSubject
      .next();
    this
      .finishSubject
      .complete();

    super.ngOnDestroy();
  }
}
