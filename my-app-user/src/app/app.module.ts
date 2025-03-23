import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/generals/header/header.component';
import { FooterComponent } from './components/generals/footer/footer.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ProductComponent } from './pages/product/product.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { ForgotPasswordAfterComponent } from './components/auth/forgotpasswordafter/forgotpasswordafter.component';
import { ResetPasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { CartComponent } from './components/order-process/cart/cart.component';
import { PaymentComponent } from './components/order-process/payment/payment.component';
import { OrderCompleteComponent } from './components/order-process/ordercomplete/ordercomplete.component';
import { AccountComponent } from './components/user-account/account/account.component';
import { AddressComponent } from './components/user-account/address/address.component';
import { OrderHistoryComponent } from './components/user-account/orderhistory/orderhistory.component';
import { WishlistComponent } from './components/user-account/wishlist/wishlist.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { PolicyReturnComponent } from './pages/policy-return/policy-return.component';
import { PolicyShippingComponent } from './pages/policy-shipping/policy-shipping.component';
import { PolicySecurityComponent } from './pages/policy-security/policy-security.component';
import { PolicyPaymentComponent } from './pages/policy-payment/policy-payment.component';
import { FAQComponent } from './pages/faq/faq.component';
import { PerfectMatchComponent } from './pages/perfectmatch/perfectmatch.component';
import { NotFoundComponent } from './components/generals/notfound/notfound.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blogdetail/blogdetail.component';
import { HomeComponent } from './pages/home/home.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { BannerComponent } from './pages/home/components/banner/banner.component';
import { DescriptionComponent } from './pages/home/components/description/description.component';
import { ShowcaseComponent } from './pages/home/components/showcase/showcase.component';
import { NewArrivalComponent } from './pages/home/components/new-arrival/new-arrival.component';
import { ServiceComponent } from './pages/home/components/service/service.component';
import { PromotionBannerComponent } from './pages/home/components/promotion-banner/promotion-banner.component';
import { AboutUsComponent } from './pages/home/components/about-us/about-us.component';
import { ProductBannerComponent } from './pages/product/components/product-banner/product-banner.component';
import { ProductListComponent } from './pages/product/components/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductInfoComponent } from './pages/product-detail/components/product-info/product-info.component';
import { ProductReviewsComponent } from './pages/product-detail/components/product-reviews/product-reviews.component';
import { FeaturedProductsComponent } from './pages/promotion/components/featured-products/featured-products.component';
import { VoucherListComponent } from './pages/promotion/components/voucher-list/voucher-list.component';
import { BannerPromotionComponent } from './pages/promotion/components/banner-promotion/banner-promotion.component';
import { FaqBannerComponent } from './pages/faq/components/faq-banner/faq-banner.component';
import { FaqListComponent } from './pages/faq/components/faq-list/faq-list.component';
import { FaqServiceComponent } from './pages/faq/components/faq-service/faq-service.component';
import { AboutUsBannerComponent } from './pages/aboutus/components/about-us-banner/about-us-banner.component';
import { AboutUsIntroComponent } from './pages/aboutus/components/about-us-intro/about-us-intro.component';
import { BannerIntroComponent } from './pages/aboutus/components/banner-intro/banner-intro.component';
import { PerfectMatchIntroComponent } from './pages/aboutus/components/perfect-match-intro/perfect-match-intro.component';
import { BannerPerfectMatchComponent } from './pages/aboutus/components/banner-perfect-match/banner-perfect-match.component';
import { AboutUsServiceComponent } from './pages/aboutus/components/about-us-service/about-us-service.component';
import { BlogBannerComponent } from './pages/blog/components/blog-banner/blog-banner.component';
import { BlogListComponent } from './pages/blog/components/blog-list/blog-list.component';
import { BlogContentComponent } from './pages/blogdetail/components/blog-content/blog-content.component';
import { RelatedBlogComponent } from './pages/blogdetail/components/related-blog/related-blog.component';
import { PolicyBannerComponent } from './pages/policy/components/policy-banner/policy-banner.component';
import { PolicyListComponent } from './pages/policy/components/policy-list/policy-list.component';
import { PerfectMatchBannerComponent } from './pages/perfectmatch/components/perfect-match-banner/perfect-match-banner.component';
import { PerfectMatchStepComponent } from './pages/perfectmatch/components/perfect-match-step/perfect-match-step.component';
import { SidebarComponent } from './components/user-account/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutusComponent,
    ProductComponent,
    
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordAfterComponent,
    ResetPasswordComponent,
    CartComponent,
    PaymentComponent,
    OrderCompleteComponent,
    AccountComponent,
    AddressComponent,
    OrderHistoryComponent,
    WishlistComponent,
    PolicyComponent,
    PolicyReturnComponent,
    PolicyShippingComponent,
    PolicySecurityComponent,
    PolicyPaymentComponent,
    FAQComponent,
    PerfectMatchComponent,
    NotFoundComponent,
    BlogComponent,
    BlogDetailComponent,
    HomeComponent,
    PromotionComponent,
    BannerComponent,
    DescriptionComponent,
    ShowcaseComponent,
    NewArrivalComponent,
    ServiceComponent,
    PromotionBannerComponent,
    AboutUsComponent,
    ProductBannerComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductInfoComponent,
    ProductReviewsComponent,
    FeaturedProductsComponent,
    VoucherListComponent,
    BannerPromotionComponent,
    FaqBannerComponent,
    FaqListComponent,
    FaqServiceComponent,
    AboutUsBannerComponent,
    AboutUsIntroComponent,
    BannerIntroComponent,
    PerfectMatchIntroComponent,
    BannerPerfectMatchComponent,
    AboutUsServiceComponent,
    BlogBannerComponent,
    BlogListComponent,
    BlogContentComponent,
    RelatedBlogComponent,
    PolicyBannerComponent,
    PolicyListComponent,
    PerfectMatchBannerComponent,
    PerfectMatchStepComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
