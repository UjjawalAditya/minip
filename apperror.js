class AppError extends Error{
    constructor(messaage,status){
        super();
        this.message=messaage;
        this.status=status;
    }
}
module.exports=AppError;