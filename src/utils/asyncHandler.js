//ekta aynchronous request handler function banamu r aidda re export korum sob page a jeidike oi async req function dorkar lgbo
//basically ida o ekta middlewre hisabe oi kaaj korbo
//***** LET'S WRITE THE CODE IN PROMISES */

const asyncHandler =(requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch( (err) => next(err))
    }
}

export { asyncHandler }


//******** LET'S WRITE THE CODE IN TRY-CATCH FORMAT *****/
//DONT MATTER WHETHER WE USE THE ABOVE PROMISES FORMAT OR THE BELOW TRY-CATCH FORMAT, BOTH GIVES THE SAME RESULT AND BOTH ARE USED IN PROFESSIONAL PRODUCTIONS


//*** any normal functio kne lekhi ---> const var_name = (func_parametrer) => { callback}
//but ai jen asyncHandler ta banamu, uida hoibo giia ekta HOF
// mane function nije ekt parameter nite parbo, abar dite o parbo
//*** eg -->  const var_name = (func_parametrer) = (parameter_of_func_parameter) => { callback}  
// eg , if async --->const f_name = (func) = async() => {}   .......its an async HOF

//***** the syncHandler function that we are gonna use will be async HOF 

// const asyncHandler= (fn) = async( req,res,next ) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         //lets send the error code or http status 500
//         //along with it lets also send an json
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
        
//     }
// }