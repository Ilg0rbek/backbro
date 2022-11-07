
import { NextFunction, Request, Response } from 'express';
import CategoryService from '@/services/categories.service';
import { Category } from '@/interfaces/category.interface';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';

class CategoriesController {
  public categoryService = new CategoryService()
  
  public getCategoryFilters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category_id = req.query.category_id as string
      const raw_categories_list = await this.categoryService.getCategoryFilters(category_id)
      res.status(200).json({data: raw_categories_list, message: 'All raw categories list'})
    } catch (error) {
      console.log("error", error)
      next(error)
    }
  }

  public getRawCategories = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const raw_categories_list = await this.categoryService.getRawCategoriesList()
      res.status(200).json({data: raw_categories_list, message: 'All raw categories list'})
    } catch (error) {
      next(error)
    }
  }

  public updateFilters = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const updatedFilter: Category = await this.categoryService.updateCategoryFilters(req.body)
      res.status(200).json({data: updatedFilter, message: 'category filters are updated'})
    } catch (error) {
      next(error)
    }
  }
  
  
  
  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allOrgs: Category[] = await this.categoryService.findAllCategories()
      res.status(200).json({ data: allOrgs, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }


  public getCategoriesCascader = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allOrgs = await this.categoryService.findAllCategoriesCascader(req.query.lang as string)
      res.status(200).json({ data: allOrgs, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgData: CreateCategoryDto = req.body
      const createOrgData: Category = await this.categoryService.createCategory(orgData)
      res.status(201).json({ data: createOrgData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: UpdateCategoryDto = req.body
      const updateCategoryData: Category = await this.categoryService.updateCategory(categoryData)
      res.status(201).json({ data: updateCategoryData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: DeleteCategoryDto = req.body
      const updateCategoryData = await this.categoryService.deleteActionOfModules(categoryData)
      res.status(201).json({ data: updateCategoryData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default CategoriesController;
