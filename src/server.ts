import App from '@/app';

// Routers from routes folder
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import RolesRoute from '@/routes/roles.route';
import validateEnv from '@utils/validateEnv';
import OrgsRoute from './routes/orgs.route';
import StaffsRoute from './routes/staffs.route';
import CategoriesRoute from './routes/categories.route';
import ProductRoute from './routes/products.route';
import StockItemsRoute from './routes/stockitems.route';
import CustomersRoute from './routes/customers.route';
import OrdersRoute from './routes/orders.route';
import CategoryFiltersRoute from './routes/category-filters.route';
import CellRoute from './routes/cell.route';
import MerchDocsRoute from './routes/merch-docs.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new RolesRoute(),
  new OrgsRoute(),
  new StaffsRoute(),
  new CategoriesRoute(),
  new ProductRoute(),
  new StockItemsRoute(),
  new CustomersRoute(),
  new OrdersRoute(),
  new CategoryFiltersRoute(),
  new CellRoute(),
  new MerchDocsRoute(),
]);

app.listen();

export const wrSocket = app.warehouseSocket;
