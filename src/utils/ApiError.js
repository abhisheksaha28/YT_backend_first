/***** CREATE A CLASS FOR TRACKING THE ERRORS THT MAY TAKE PLACE, USING OOP CONCEPT ******/
// we aare creating classes so that we can over ride the errors, so that we can get more specified info about erors


class ApiError extends Error{
    //create a constructor
    constructor(
        statusCode,
        message= "Something went wrong",//if no msg is send, then this msg will be sned, though this does not specifies any error
        errors=[], //we will pass an array for all the possible type of erros
        stack = "" //erroe stack, initially empty
    ){
        //**>> above e have written the constaructor code, now we will overwite them here 
        super(message)
        //over write status code
        this.statusCode =  statusCode
        //lets set the data to null, aas currently there is no data given
        this.data = null
        //send msg
        this.message = message
        this.success = false;
        this.errors = errors

        //**** for proprlly tracing wher and what the errors are, we will write tthe code for yhe stack 

        //if stack is there,pass it
        if(stack){
            this.stack = stack

        }
        else{
            //kunu error stack na thakle
            Error.captureStackTrace(this,this.constructor)
        }


    }
}


export { ApiError }