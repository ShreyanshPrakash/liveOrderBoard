class LiveBoard{

    /*
      requiredFields : array of items fields for validation. If empty, no validation is done.
      summaryPattern : a string pattern to be used to map all the data as summary
            eg : '[orderQuantity] kg for $[pricePerKg] order [orderList]'
               : [key] => keys need to be same as keys of the item passed.  
    */

    constructor( 
        requiredFields = [], 
        summaryPattern = '[orderQuantity] kg for $[pricePerKg] order [orderList]'
    ){
        this.liveBoardItems = new Map();
        this.itemSummary = new Map();

        this.requiredFields = requiredFields;
        this.summaryPattern = summaryPattern;
    }

    /*
        item : item to register
        Logic : Checks for validation, then creates a unique hashId to be used by this class internally.
        @return : returns the final Map after adding item.
    */
    registerItem( item ){
        let isValidItem = this.itemHasRequiredFields(item);
        if( isValidItem.valid ){
            let uniqueItemId = Math.random().toString(16).slice(2);
            item.hashId = uniqueItemId;
            this.generateItemSummary( item );
            return this.liveBoardItems.set(
                uniqueItemId,
                item
            );
        }
        return isValidItem;
    }


    /*
        Deletes an item using hashId
    */
    cancelItem( item ){
        this.liveBoardItems.delete( item.hashId );
        return this.liveBoardItems;
    }

    // Get the itemsMap with the hasId
    getRegisteredItems(){
        return Array.from(this.liveBoardItems.values());
    }

    // Get the itemsMap without the hasId
    getRawRegisteredItems(){
        let data = Array.from(this.liveBoardItems.values()).map( item => {
            delete item.hashId;
            return item;
        })
        return data;
    }

    getRawItemSummary(){
        return this.itemSummary;
    }

    /*
        Generates string summary as per the summary pattern passed.
    */
    getItemSummary(){
        let summary = Array.from( this.itemSummary.values() ).map( item => {
            // let summaryString = `${item.orderQuantity} kg for $${item.pricePerKg} order ${item.hashId}`;
            let summaryString = this.summaryPattern;

            for( let key of Object.keys( item ) ){
                summaryString = summaryString.replace(`[${key}]`, item[key])
            }

            let length = item.similarOrder.length;
            let orderListString = '';
            item.similarOrder.map( (orderId, index) => {
                if( index === length - 1 ){
                    orderListString += ` & ${orderId}`; 
                }else if( index === 0 ){
                    orderListString += `${orderId}`; 
                }else{
                    orderListString += `, ${orderId}`;
                }
            })

            summaryString = summaryString.replace(`[orderList]`, orderListString)
            return summaryString;
        })

        return summary;

    }


    /*
        Utility methods
    */

    /*
        Checks for validity of the item
        @return : an object with valid and message
    */
    itemHasRequiredFields( item ){
        if( this.requiredFields.length ){
            let itemFields = Object.keys( item );
            for( let field of this.requiredFields ){
                if( itemFields.indexOf( field ) === -1 ){
                    return {
                        valid: false,
                        message : `${field} is mandatory field but is absent in the item passed.`,
                        item : item
                    };
                }
            }
        }
        return {
            valid: true,
            item: item,
        };
    }

    /*
        Generated the array of string summary
    */
    generateItemSummary( item ){
        if( this.itemSummary.has(item.pricePerKg) ){
            let similarItem = this.itemSummary.get( item.pricePerKg )
            similarItem.similarOrder.push( item.hashId );
            console.log( item.orderType, similarItem.orderType, item.orderType == similarItem.orderType )
            if( item.orderType == similarItem.orderType ){
                similarItem.orderQuantity += item.orderQuantity;
            }else{
                similarItem.orderQuantity = Math.abs(
                    item.orderQuantity - similarItem.orderQuantity
                )
                if( item.pricePerKg >= similarItem.pricePerKg ){
                    similarItem.orderType = item.orderType;
                }
            }
        }else{
            let similarItem = Object.assign({}, item);
            similarItem.similarOrder = [similarItem.hashId];
            this.itemSummary.set( item.pricePerKg, similarItem );
        }
    }

}

module.exports =  LiveBoard;