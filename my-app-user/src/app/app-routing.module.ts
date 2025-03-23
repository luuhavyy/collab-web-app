import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
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


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Trang mặc định
  { path: 'home', component: HomeComponent, data: { title: 'Collab Eyewear' } }, // Trang chủ
  { path: 'register', component: RegisterComponent, data: { title: 'Đăng ký - Collab Eyewear' } },
  { path: 'login', component: LoginComponent, data: { title: 'Đăng nhập - Collab Eyewear' } },
  { path: 'forgotpassword', component: ForgotPasswordComponent, data: { title: 'Quên mật khẩu - Collab Eyewear' } },
  { path: 'forgotpasswordafter', component: ForgotPasswordAfterComponent, data: { title: 'Xác nhận quên mật khẩu - Collab Eyewear' } },
  { path: 'resetpassword', component: ResetPasswordComponent, data: { title: 'Đặt lại mật khẩu - Collab Eyewear' } },
  { path: 'account', component: AccountComponent, data: { title: 'Tài khoản - Collab Eyewear' } },
  { path: 'address', component: AddressComponent, data: { title: 'Địa chỉ - Collab Eyewear' } },
  { path: 'orderhistory', component: OrderHistoryComponent, data: { title: 'Lịch sử đơn hàng - Collab Eyewear' } },
  { path: 'wishlist', component: WishlistComponent, data: { title: 'Danh sách yêu thích - Collab Eyewear' } },
  { path: 'aboutus', component: AboutusComponent, data: { title: 'Về chúng tôi - Collab Eyewear' } },
  { path: 'policy', component: PolicyComponent, data: { title: 'Chính sách - Collab Eyewear' } },
  { path: 'policy-return', component: PolicyReturnComponent, data: { title: 'Chính sách đổi trả - Collab Eyewear' } },
  { path: 'policy-shipping', component: PolicyShippingComponent, data: { title: 'Chính sách giao hàng - Collab Eyewear' } },
  { path: 'policy-security', component: PolicySecurityComponent, data: { title: 'Chính sách bảo mật - Collab Eyewear' } },
  { path: 'policy-payment', component: PolicyPaymentComponent, data: { title: 'Chính sách thanh toán - Collab Eyewear' } },
  { path: 'faq', component: FAQComponent, data: { title: 'Câu hỏi thường gặp - Collab Eyewear' } },
  { path: 'perfect-match', component: PerfectMatchComponent, data: { title: 'Perfect Match - Collab Eyewear' } },
  { path: 'blog', component: BlogComponent, data: { title: 'Bài viết - Collab Eyewear' } },
  { path: 'blog/:id', component: BlogDetailComponent, data: { title: 'Chi tiết bài viết - Collab Eyewear' }},
  { path: 'product', component: ProductComponent, data: { title: 'Sản phẩm - Collab Eyewear' } },
  { path: 'product/:id', component: ProductDetailComponent, data: { title: 'Chi tiết sản phẩm - Collab Eyewear' } },
  { path: 'promotion', component: PromotionComponent, data: { title: 'Giảm giá - Collab Eyewear' } },
  { path: 'cart', component: CartComponent, data: { title: 'Giỏ hàng - Collab Eyewear' } },
  { path: 'payment', component: PaymentComponent, data: { title: 'Thanh toán - Collab Eyewear' } },
  { path: 'ordercomplete', component: OrderCompleteComponent, data: { title: 'Hoàn tất đơn hàng - Collab Eyewear' } },
  { path: 'not-found', component: NotFoundComponent, data: { title: 'Không tìm thấy trang - Collab Eyewear' } },
  { path: '**', redirectTo: 'not-found' } // Bất kỳ đường dẫn nào không tồn tại sẽ về trang 404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
