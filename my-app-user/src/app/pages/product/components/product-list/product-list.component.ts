import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { WishlistService } from 'src/app/services/wishlist.service';
import { WishlistItem } from 'src/app/models/wishlist.model';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];
  wishlist: Set<string> = new Set<string>();

  currentPage: number = 1;
  productsPerPage: number = 12;
  totalPages: number = 0;
  filterCategory: string = 'All';
  sortType: string = 'default';

  constructor(private productService: ProductService,
              private wishlistService: WishlistService,
              private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.applyFilters(); // Khởi động = filter (đã tích hợp sắp xếp)
    this.loadWishlist();

  }

  loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = ['All', ...categories];
    });
  }

  applyFilters() {
    const fetchFn = this.filterCategory === 'All'
      ? this.productService.getProducts()
      : this.productService.getProductsByCategory(this.filterCategory);

    fetchFn.subscribe((products) => {
      this.products = products.map(product => ({
        ...product,
      }));
      this.applySorting(); // lọc xong thì sắp xếp luôn
    });
  }

  applySorting() {
    let tempProducts = [...this.products];

    if (this.sortType === 'low-to-high') {
      tempProducts.sort((a, b) => 
        this.convertPriceToNumber(a.price) - this.convertPriceToNumber(b.price)
      );
    } else if (this.sortType === 'high-to-low') {
      tempProducts.sort((a, b) => 
        this.convertPriceToNumber(b.price) - this.convertPriceToNumber(a.price)
      );
    }

    this.filteredProducts = tempProducts;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.displayedProducts = this.filteredProducts.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  addToCart(product: Product) {
    if (!this.cartService) {
      console.error("CartService chưa được khởi tạo!");
      return;
    }
  
    // Tạo đối tượng CartItem từ Product
    const cartItem: CartItem = {
      product_id: product._id, // Lấy ID sản phẩm
      quantity: 1, // Mặc định thêm 1 sản phẩm
      item_price: this.convertPriceToNumber(product.price), // Chuyển đổi giá
    };
  
    console.log("Thêm vào giỏ hàng:", cartItem);
  
    this.cartService.addToCart(cartItem).subscribe(() => {
      alert(`Đã thêm vào giỏ hàng!`);
    }, (error) => {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    });
  }
  

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe((wishlist: any[] = []) => {
      if (wishlist.length === 0) {
        this.wishlist = new Set();
        return;
      }
  
      if (typeof wishlist[0] === 'string') {
        // localStorage guest mode: string[]
        this.wishlist = new Set(wishlist as string[]);
      } else {
        // API DB mode: WishlistItem[]
        this.wishlist = new Set(
          (wishlist as WishlistItem[]).map((item: WishlistItem) => item.product_id)
        );
      }
    });
  }
  
  toggleWishlist(product: Product) {
    const isWishlisted = this.wishlist.has(product._id);
  
    const action$ = isWishlisted
      ? this.wishlistService.removeFromWishlist(product._id)
      : this.wishlistService.addToWishlist(product._id);
  
    action$.subscribe(() => {
      isWishlisted
        ? this.wishlist.delete(product._id)
        : this.wishlist.add(product._id);
    });
  }  

  isWishlisted(product: Product): boolean {
    return this.wishlist.has(product._id);
  }

  convertPriceToNumber(price: any): number {
    if (typeof price === 'object' && price.$numberDecimal) {
      price = price.$numberDecimal;
    }
    return parseFloat(price.toString().replace(/\./g, '').replace(',', '.'));
  }

  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }
}
