import { API_ENDPOINTS } from "../utils/apiEndpoints";
import http from "./http";

export const REQUEST_TEMPLATE = (endpoint: string) => ({
  create: async (requestBody: any) =>
    await http({}).post(endpoint, requestBody),
  auth: async (requestBody: any) =>
    await http({ isAuth: true }).post(endpoint, requestBody),
  update: async (id: any, requestBody: string) =>
    http({}).post(`${endpoint}/${id}`, requestBody),
  updateWithId: async (id: any) => http({}).post(`${endpoint}/${id}`),
  updateWithOutId: async (requestBody: any) =>
    http({}).put(endpoint, requestBody),
  delete: async (id: string) => http({}).delete(`${endpoint}/${id}`, {}),
  updateWith: async (requestBody: any) => http({}).put(endpoint, requestBody),
  getAll: async () => http({}).get(`${endpoint}`),
  get: async () => http({}).get(`${endpoint}`),
  getById: async (id: any) => http({}).get(`${endpoint}/${id}`, {}),
  getByString: async (customerName: string) =>
    http({}).get(`${endpoint}/${customerName}`, {}),
  createWithHeader: async (requestBody: any, queryParameters: any) =>
    await http({}).post(endpoint, requestBody, queryParameters),
  updatePatch: async (id: any, requestBody: any) =>
    http({}).patch(`${endpoint}/${id}`, requestBody),
  updatePatchNoId: async (requestBody: any) =>
    http({}).patch(`${endpoint}`, requestBody),
});

const Location = REQUEST_TEMPLATE("location");
const User = REQUEST_TEMPLATE("users");
const Menue = REQUEST_TEMPLATE("menue");
const MenueCategory = REQUEST_TEMPLATE("menue-category");
const TableApi = REQUEST_TEMPLATE("table");
const Order = REQUEST_TEMPLATE("order");
const CompanyTransaction = REQUEST_TEMPLATE("company-transactions");

const Game = REQUEST_TEMPLATE("game");
const Role = {
  getAll: REQUEST_TEMPLATE("role").getAll,
};

const Dashboard = {
  totalCustomers: REQUEST_TEMPLATE("customers/total-customer").get,
  totalCredit: REQUEST_TEMPLATE("company-transactions/total-credit").get,
  totalDebit: REQUEST_TEMPLATE("company-transactions/total-debit").get,
};
const Menues = {
  updateMenue: REQUEST_TEMPLATE("menue/update-menu").create,
  updateMenueWithHeader: REQUEST_TEMPLATE("menue/update-menu").createWithHeader,
  saveMenueWithImage: REQUEST_TEMPLATE("menue").createWithHeader,
  deleteMenue: REQUEST_TEMPLATE("menue/delete-menue")
    .create,
};

const MenueCategories = {
  updateMenueCategory: REQUEST_TEMPLATE("menue-category/update-menue-category")
    .create,
  updateMenueCategoryWithHeader: REQUEST_TEMPLATE(
    "menue-category/update-menu-category"
  ).createWithHeader,
  saveMenueCategoryWithImage:
    REQUEST_TEMPLATE("menue-category").createWithHeader,
  getMenueByCategoryId: REQUEST_TEMPLATE("menue/category").getById,
  deleteMenueCategory: REQUEST_TEMPLATE("menue-category/delete-menue-category")
    .create,
};

const Orders = {
  getOrderStatus: REQUEST_TEMPLATE("order/get-order-status").getById,
  getOrderBySatatus: REQUEST_TEMPLATE("order/status").getById,
  getOrderBill: REQUEST_TEMPLATE("order/bill").getById,
  updateOrderStatus: REQUEST_TEMPLATE("order/update-order-status").updatePatch,
  getFilteredOrderList: REQUEST_TEMPLATE("order/filter-orders").create,
  getCurrentOrderByTableId: REQUEST_TEMPLATE("order/get-current-order-by-table-id").getById,
};

const TableAPIs = {
  updateTalbe: REQUEST_TEMPLATE("table/update-table").create,
  getTableId: REQUEST_TEMPLATE("table/get-table").getByString,
};

const CustomerDocuments = {
  saveDocs: REQUEST_TEMPLATE("/customer-documents/upload").createWithHeader,
  getCustomerDocs: REQUEST_TEMPLATE("/customer-documents/customer-images")
    .getById,
};

const ExpenseHeads = {
  updateExpenseHead: REQUEST_TEMPLATE("expenses/update").create,
};

const CompanyTransactions = {
  addTransaction: REQUEST_TEMPLATE("company-transactions/add-payment").create,
  deleteTransaction: REQUEST_TEMPLATE("company-transactions/delete")
    .updateWithId,
  getById: REQUEST_TEMPLATE("company-transactions").getById,
};

const Games = {
  updateGame: REQUEST_TEMPLATE("game/update-game").create,
  createGame: REQUEST_TEMPLATE("game").createWithHeader,
};

const Inventory = {
  saveInventory: REQUEST_TEMPLATE("inventory").create,
  getInventoryList: REQUEST_TEMPLATE("inventory").getById,
  getInventoryConfirmList: REQUEST_TEMPLATE("inventory/confirm").getAll,
};
const DailySale = {
  getDailySale: REQUEST_TEMPLATE("daily-sale").getById,
  getDailySaleList: REQUEST_TEMPLATE("daily-sale/get-daily-sale").getAll,
  getIsCurrentDay: REQUEST_TEMPLATE("daily-sale/is-current-day").getById,
  dayEnd: REQUEST_TEMPLATE("daily-sale").create,
};

const Sale = {
  getSaleList: REQUEST_TEMPLATE("sales").getById,
  pushedActiveToSale: REQUEST_TEMPLATE("sales/active").create,
  pushedBulkActiveToSale: REQUEST_TEMPLATE("sales/active/bulk").create,
  multiScanAndVerify: REQUEST_TEMPLATE("sales/multi/scan").create,
  updateGameNumber: REQUEST_TEMPLATE("sales").updatePatch,
  updateScanGameNumber: REQUEST_TEMPLATE("sales/scan_code").create,
  getDayChange: REQUEST_TEMPLATE("sales/next-prev-sale-id").getById,
  gameSoldOut: REQUEST_TEMPLATE("sales/game/soldout").create,
  isVerify: REQUEST_TEMPLATE("sales/verify-sale").create,
};

const Auth = {
  login: REQUEST_TEMPLATE(API_ENDPOINTS.LOGIN).create,
  signup: REQUEST_TEMPLATE(API_ENDPOINTS.REGISTER).create,
};

export {
  Location,
  Game,
  Auth,
  User,
  Dashboard,
  Menue,
  MenueCategory,
  MenueCategories,
  Menues,
  CustomerDocuments,
  TableApi,
  TableAPIs,
  Order,
  Orders,
  ExpenseHeads,
  CompanyTransaction,
  CompanyTransactions,
  Inventory,
  DailySale,
  Sale,
  Games,
  Role,
};
