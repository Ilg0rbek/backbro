import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import categoryModel from '@/models/categories.model';
import { Category } from '@/interfaces/category.interface';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';
import { Document, Types } from 'mongoose';
import categoryFiltersModel from '@/models/category-filters.model';
import { CategoryFilters } from '@/interfaces/filters.interface';


class CategoryFiltersService {
    public filtersModel = categoryFiltersModel
    // 

    public async getFilters(): Promise<(CategoryFilters | Document)[]> {
        return await this.filtersModel.find().select("-__v")
    }

    public async newFilter(filterData: CategoryFilters): Promise<CategoryFilters> {
        if (isEmpty(filterData)) throw new HttpException(400, "You're not roleData");
        const newFilterDataData = await this.filtersModel.create(filterData);
        return newFilterDataData;
    }
}

export default CategoryFiltersService;
