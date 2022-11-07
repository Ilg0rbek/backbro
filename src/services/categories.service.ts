import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import categoryModel from '@/models/categories.model';
import { Category } from '@/interfaces/category.interface';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';
import { Document, Types } from 'mongoose';


class CategoryService {
    public categories = categoryModel

    public async getCategoryFilters(category_id: string): Promise<(Category['filters'] | Document)> {
        const filters = await this.categories.findOne({category: category_id}).populate({
            path: 'filters',
            select: "-__v"
        }).select(['filters']).exec()
        console.log("filters", filters.filters)
        return filters.filters
    }

    public async getRawCategoriesList(): Promise<Category[]> {
        return await this.categories.find()
    }




    public createCategoryList(categories: Category[], parent = '/'): any {
        const categoryList = []
        let category = categories.filter(cat => cat.parent === parent)
        for (let cate of category) {
            categoryList.push({
                _id: cate._id,
                name_uz: cate.name_uz,
                name_en: cate.name_en,
                name_ru: cate.name_ru,
                filters: cate.filters,
                category: cate.category,
                label: cate.parent,
                parent: cate.parent,
                children: this.createCategoryList(categories, cate.category)
            })
        }
        return categoryList
    }

    public createCategoryListCascader(categories: Category[], lang: string, parent = '/'): any {
        const categoryList = []
        let category = categories.filter(cat => cat.parent === parent)
        for (let cate of category) {
            categoryList.push({
                _id: cate._id,
                name_uz: cate.name_uz,
                name_en: cate.name_en,
                name_ru: cate.name_ru,
                filters: cate.filters,
                value: cate.category,
                label: cate[`name_${lang}`],
                children: this.createCategoryListCascader(categories, lang, cate.category)
            })
        }
        return categoryList
    }

    public async findAllCategoriesCascader(lang: string): Promise<any[]> {
        const categories: Category[] = await this.categories.find();
        return this.createCategoryListCascader(categories, lang);
    }

    public async updateCategoryFilters(filterBody: { _id: string; filter_ids: string[]; action: string }): Promise<Category> {
        if (filterBody.action === 'add') {
            const updatedCategory: Category = await this.categories.findOneAndUpdate({category: filterBody._id}
                , {
                    $push: {
                        filters: filterBody.filter_ids
                    }
                })
            return updatedCategory
        } else {
            const updatedCategory: Category = await this.categories.findOneAndUpdate({category: filterBody._id}
                , {
                    $pull: {
                        "filters": new Types.ObjectId(filterBody.filter_ids[0]+'')
                    }
                })
            return updatedCategory
        }
    }


    public async findAllCategories(): Promise<any[]> {
        const categories: Category[] = await this.categories.find();
        return this.createCategoryList(categories);
    }

    public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(categoryData)) throw new HttpException(400, "You're not roleData");
        const createCategoryData = await this.categories.create(categoryData);
        return createCategoryData;
    }

    public async updateCategory(categoryData: UpdateCategoryDto): Promise<Category> {
        if (isEmpty(categoryData)) throw new HttpException(400, "You're not roleData");

        const updatedcategory: Category = await this.categories.findByIdAndUpdate(categoryData._id, {
            $set: {
                name_uz: categoryData.name_uz,
                name_en: categoryData.name_en,
                name_ru: categoryData.name_ru,
            }
        });
        return updatedcategory;
    }

    public async deleteActionOfModules(categoryData: DeleteCategoryDto): Promise<any> {
        const updatedActionResult = await this.categories.deleteMany({
            $or: [{
                category: {
                    $regex: categoryData.category, $options: 'i',
                }
            }, {
                parent: {
                    $regex: categoryData.category, $options: 'i',
                }
            }]
        }).exec()
        return updatedActionResult
    }
}

export default CategoryService;
