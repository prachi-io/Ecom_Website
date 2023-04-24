class ApiFeatures {
    constructor(query,queryStr) {
        // query -> Product.find()
        //queryStr -> keyword=samosa
        this.query = query;
        this.queryStr = queryStr
    }

    // hum find ke bracket me bhi define kar sakte the but tab vo sirf vahi naam ka deta hame usse milta junta bhi chhahiye but
    // so using this
    // samosa -> likha h but we want jisme bhi samosa ho eg -> samosaosa

    search() {
        const keyword = this.queryStr.keyword ? {
            name :{
                $regex:this.queryStr.keyword,
                $options:"i", // case insensitive
            },
        } : {}

        // console.log(keyword)
        this.query = this.query.find({...keyword});
        return this;
    }

    // price ke liye we cant use this as exact price nahi range choose karte h
    filter() {
        const queryCopy = {...this.queryStr} // directly likhte to refrence milta copy nahi banti
        // console.log(queryCopy)
        // removing some fields for category
        const removeFields = ["keyword","page","limit"]; // ye fields vo h jo ? ke baad aati h

        removeFields.forEach(key=>delete queryCopy[key])


        // gt lt use kara h
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`)

        this.query=this.query.find(JSON.parse(queryStr))

        return this
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        // 50 products -> 10 product per page
        // 1st page -> no skip as starting 10
        // 2nd page -> skip 10 of starting
        // 3rd page -> skip 20 of starting
        // 4th page -> skip 40 of starting
        const skip = resultPerPage * (currentPage-1)

        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures