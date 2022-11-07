
import { NextFunction, Request, Response } from 'express';
import CategoryService from '@/services/categories.service';
import { Category } from '@/interfaces/category.interface';
import CategoryFiltersService from '@/services/category-filter.service';
import { CategoryFilters } from '@/interfaces/filters.interface';

class CategoryFiltersController {
  public filtersService = new CategoryFiltersService()

  public getFilters = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const filters_list = await this.filtersService.getFilters()
      res.status(200).json({data: filters_list, message: 'All filters list'})
    } catch (error) {
      next(error)
    }
  }

  public newFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterData: CategoryFilters = req.body
      const generatedFilterData: CategoryFilters = await this.filtersService.newFilter(filterData)
      res.status(201).json({ data: generatedFilterData, message: 'new filter generated' })
    } catch (error) {
      next(error)
    }
  }
}

export default CategoryFiltersController;
