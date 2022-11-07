import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// import validationMiddleware from '@middlewares/validation.middleware';
// import authMiddleware from '@/middlewares/auth.middleware';
// import CategoriesController from '@/controllers/category.controller';
// import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';
import CategoryFiltersController from '@/controllers/category-filters.controller';

class CategoryFiltersRoute implements Routes {
  public path = '/category-filter';
  public router = Router();
  public categoryFiltersController = new CategoryFiltersController()

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // Category-filters
    this.router.get(`${this.path}`, this.categoryFiltersController.getFilters);
    this.router.post(`${this.path}`, this.categoryFiltersController.newFilter);
  }
}

export default CategoryFiltersRoute;
