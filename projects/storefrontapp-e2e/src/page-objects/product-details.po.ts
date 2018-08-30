import { browser, ElementFinder, by, element } from 'protractor';
import { AppPage } from './app.po';
import { E2EUtil } from '../e2e-util';

export class ProductDetailsPage extends AppPage {
  readonly YPAGE = 'y-product-page';

  readonly page: ElementFinder = element(by.tagName(this.YPAGE));
  readonly addToCartComponent: ElementFinder = this.page.element(
    by.tagName('y-add-to-cart')
  );
  readonly productSummaryComponent: ElementFinder = this.page.element(
    by.tagName('y-product-summary')
  );
  readonly outOfStockDiv: ElementFinder = this.productSummaryComponent.element(
    by.cssContainingText('div', 'outOfStock')
  );
  readonly addToCartButton: ElementFinder = this.addToCartComponent.element(
    by.tagName('button')
  );
  readonly productQuantitySpan: ElementFinder = this.addToCartComponent.element(
    by.css('span[class="entry-quantity ng-star-inserted"]')
  );

  async navigateTo(productId: string) {
    await browser.get('/product/' + productId);
    await this.waitForReady();
  }

  async waitForReady() {
    await E2EUtil.wait4VisibleElement(this.page);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
