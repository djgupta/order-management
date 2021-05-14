# order-management
This is a node and mongo based rest application that has exposed crud operations for items, inventories and orders. \
items are the food products \
inventory is the quantity available for the items \
orders contains items and their quantities 

## Applications to install:
Node (https://nodejs.org/en/download/) \
MongoDB (https://docs.mongodb.com/manual/installation/)

## How to run:
starts mongodb server -> mongo_db_path\bin\mongod  \
installs all node dependencies -> npm install \
starts the node server and hosts the API -> node ./bin/www\
All the APIs are listed in orders.api.json (it can be imported into postman) 

## Database schema
3 collections - items, inventory, orders \
items document = ["name", "type", "course", "price"] \
inventory document = ["itemId", "itemName", "quantity"] \
order document = [items : ["itemId", "itemName", "quantity"]] 

## Modules
4 modules - config, items, inventory, orders 

### config module
GET /config/reload : api takes care of collection creation and filling up the items table via csv 

### items module
GET /items : gets all items \
GET /item/:itemId : gets an item by id \
PUT /item/:itemId {} : replaces an item based on id \
DELETE /item/:itemId : deletes an item by id \
POST /item {}: creates a new item \
POST /item/query {} : search for specific items, sort on keys, paginated results 

### inventory module
GET /inventory : gets all inventories \
GET /inventory/:inventoryId : gets an inventory by id \
DELETE /inventory/:inventoryId : deletes an inventoryId by id \
POST /inventory {}: creates a new inventory 

### order module
GET /orders : gets all orders \
GET /orders/:orderId : gets an order by id \
DELETE /orders/:orderId : deletes an orderId by id \
POST /orders {}: creates a new order 

## Design
User can query the items to find the items of their choice. \
User can place order for multiple items along with its quantities. \
When user places an order, if inventory is available for the items, inventory of these items is decreased by the quantity in the order. \
If atleast one item does not have sufficent inventory, then the items in the order that are already processed are reverted by adding back the item quantity to the inventory. \
The user is notified which item was out of stock. \
Otherwise, user is notified that order is placed. 

## Enhancements
For loops could be replaced with workers \
Validations on the APIs \ 
save failed orders \ 
ability to store historical data \
mongoose? \
add users \ 
simple UI