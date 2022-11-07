import { Category } from '@/interfaces/category.interface';
import { model, Schema, Document, Types } from 'mongoose';

const categorySchema: Schema = new Schema({
  name_uz: String,
  name_en: String,
  name_ru: String,
  filters: {
    type: [{
      type: Types.ObjectId,
      ref: 'CategoryFilters'
    }],
    default: []
  },
  active_state: {
    type: Boolean,
    default: true
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: true
  },
},  {
  timestamps: true
});

const categoryModel = model<Category & Document>('Category', categorySchema);
export default categoryModel;

/* 
Option 1.
{
  "name": "small"
  , "parent": "/cases"
  , "category": "/cases/small"
}



Option 2. Model Tree Structures with Materialized Paths
[
  { _id: "Books", path: null},
  {_id: "Programming", path: ",Books,"},
  {_id: "Database", path: ",Books,Programming"},
  {_id: "Languages", path: ",Books,Programming"},
  {_id: "MongoDB", path: ",Books,Programming,Databses,"}
]

- You can query to retrieve the whole tree, sortiong by the field  `path`:

    db.categories.find().sort({path: 1})

- You can use regualr expressions on the `path` field to find descendants of `Programming`

    db.categories.find({ path: /,Programming,/ })

- You can also retrieve the descendants of `Books` where the `Books` is also at the topmost level of the hierarchy:

    db.categories.find({ path: /^,Books,/ })

- To create an index on the field `path` using the following invocation:

    db.categories.createIndex( {path: 1 })



Option 3. Model Tree Structures with Parent Referencing

Pattern 


The Parent Referencing pattern store each tree node in a document; in addition to the tree node, the document
stores the id of the node's parent


    db.categories.insertMany([
      { _id: "MongoDB", parent: "Databases" },
      { _id: "dbm", parent: "Databses" },
      { _id: "Databses", parent: "Programming" },
      { _id: "Languages", parent: "Programming"},
      { _id: "Programming", parent: "Books"},
      { _id: "Books", parent: null }
    ])

- The query to retrieve the parent of a node is fast and straightforward:
    
    db.categories.findOne( { _id: "MongoDB" }).parent

- You can create an index on the field `parent` to enable fast search parent node:

    db.categories.createIndex( {parent: 1})

- You can query `parent` field to finish its immediate child nodes:
  
    db.categories.find({ parent: "Databses" })

- To retrieve subtree, see $graphLookup













Option 4. Model Tree Structures with Child References
  
Pattern

The Child References pattern stores each tree node in a document; in addition to the tree node, document stores in an array the id(s) of the node's children;

  db.categories.insertMany( [
    { _id: "MongoDB", children: [] },
    { _id: "dbm", children: [] },
    { _id: "Databses", chidren: ["MongoDB", "dbm"] },
    { _id: "Languages", children: [] },
    { _id: "Programming", children: ["Databses", "Languages"] },
    { _id: "Books", children: ["Programming"] }
  ])


- The query to retrieve the immediate children of a node is fast and straightforward:
  
  db.categories.findOne( { _id: "Databses"}).children

- You can create an index on the field `children` to enable, fast search by the child nodes:

  db.categories.createIndex( { children: 1 })

- You can query for a node in the `children` field to find its parent node as well as its siblings:

  db.categories.find( { children: "MongoDB" })




Option 5. Model Tree Structures with an Array of Ancestors


Pattern 

The Arrya of Ancestors patter stores each three node in a document; in addtion to the tree node,
document stores in an array th id(s) of the node's acncestors or path:


db.categories.insertMany([
  { _id: "MongoDB", acncestors: ["Books", "Programming", "Databses"], parent: "Databses" },
  { _id: "dbm", acncestors: ["Books", "Programming", "Databses"], parent: "Databses" },
  { _id: "Databses", acncestors: ["Books", "Programming"], parent: "Programming" },
  { _id: "Languages", acncestors: ["Books", "Programming"], parent: "Programming"},
  { _id: "Programming", acncestors: ["Books"], parent: "Books" },
  { _id: "Books", acncestors: [], parent: null}
])





4. Model Tree Structures with Materialized Paths
5. Model Tree Structures with Nested Sets




* */

