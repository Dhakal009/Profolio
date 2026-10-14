POSHAK — a single-vendor online clothing store for men and women. Customers browse a catalog, filter and search it, add items to a cart, enter shipping details, complete a demo payment, and see an order confirmation. Admins manage the product catalog and view incoming orders.

Target users

Shopper — wants to find clothing by category/gender/price quickly and check out without friction.

Admin — wants to add/edit/remove products and see what was ordered.

Functional requirements (MVP)

FR1 Email/password registration and login; JWT-based sessions; customer and admin roles

FR2 Homepage: hero billboard, category tiles, featured products

FR3 Product listing with search (name), filter (category, gender, price range), sort (price, newest)

FR4 Product detail page

FR5 Cart: add, update quantity, remove, persists across reloads

FR6 Shipping details form + order review

FR7 Demo eSewa-style payment flow → order created

FR8 Order confirmation page

FR9 Admin: product CRUD, order list with status

Non-functional requirements

Mobile-responsive (Tailwind breakpoints)

Passwords hashed (bcrypt), never returned by the API

All admin routes protected server-side, not just hidden in the UI

Secrets in .env, never committed

Page loads under ~2s on a decent connection (no bloated deps)

3. User stories & acceptance criteria
ID	Story	Acceptance criteria
US-01	As a visitor I can browse the homepage	Hero banner renders; ≥3 category tiles; ≥4 featured products loaded from API; page works at 375px width
US-02	As a visitor I can filter the catalog	Selecting a category + gender + price range updates the grid; URL query params reflect filters so the view is shareable
US-03	As a visitor I can search	Typing a term and submitting shows only products whose name matches (case-insensitive); empty result shows an "no products found" state
US-04	As a visitor I can view a product	Detail page shows name, price, images, description, sizes, stock status, Add to Cart
US-05	As a visitor I can use a cart	Add/increment/decrement/remove work; badge count updates; cart survives page reload
US-06	As a visitor I can register/login	Invalid email or short password is rejected with a readable error; successful login stores a token and updates the navbar to show the user
US-07	As a logged-in customer I can check out	Shipping form validates required fields; order summary shows correct totals; submitting creates an order and redirects to payment
US-08	As a customer I can pay (demo)	Redirect to an eSewa-style page; on "success" the order is marked paid and I land on a confirmation page with an order ID; on "failure" the order stays pending and I can retry
US-09	As an admin I can manage products	Create/edit/delete works; only role: admin can reach these endpoints (verified with a customer token → 403)
US-10	As an admin I can view orders	List shows order ID, customer, items, total, status; can update status
4. MVP vs. later
MVP (must ship)
Auth · Homepage · Listing + filter + search · Detail · Cart · Shipping · Demo payment · Order confirmation · Admin product CRUD + order list

Deferred (explicitly out of scope)
Wishlist · reviews/ratings · coupons · real image upload (Cloudinary/S3) · multiple addresses · order tracking · email notifications · inventory alerts · size/color variants beyond a simple sizes array · analytics dashboard · multi-vendor · real eSewa sandbox