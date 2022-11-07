import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
// import authMiddleware from '@/middlewares/auth.middleware';
import CategoriesController from '@/controllers/category.controller';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';

class CateogriesRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public categoriesController = new CategoriesController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Orgs 
    this.router.get(`${this.path}`, this.categoriesController.getCategories);
    this.router.get(`${this.path}/raw`, this.categoriesController.getRawCategories);
    this.router.get(`${this.path}/category-filters`, this.categoriesController.getCategoryFilters);
    this.router.get(`${this.path}/cascader`, this.categoriesController.getCategoriesCascader);
    this.router.post(`${this.path}`, validationMiddleware(CreateCategoryDto, 'body'), this.categoriesController.createCategory);
    this.router.put(`${this.path}`, validationMiddleware(UpdateCategoryDto, 'body'), this.categoriesController.updateCategory);
    this.router.put(`${this.path}/add-or-remove-filter`, this.categoriesController.updateFilters);
    this.router.delete(`${this.path}`, validationMiddleware(DeleteCategoryDto, 'body'), this.categoriesController.deleteCategory);
  }
}

export default CateogriesRoute;
