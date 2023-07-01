const isValid= (value) => {
    if(value === null || typeof value === "undefined") return false
    if(typeof value === "string" && value.trim().length === 0) return false

    return true
}

module.exports= {isValid}