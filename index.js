module.exports.default = setJsonp

function setJsonp(url, params = null) {
    return new Promise((resolve, reject) => {
        let randomStr = (function () {
            return (Math.floor(Math.random() * 100000) * Date.now()).toString(16)
        })()
        let sc = document.createElement('script')
        let paramsStr = ''
        if (params) {
            Object.keys(params).forEach(key => {
                paramsStr += `&${key}=${params[key]}`
            })
        }
        sc.setAttribute('src', `${url}?callback=jsonp${randomStr}${paramsStr}`)
        sc.setAttribute('name', `jsonp${randomStr}`)
        sc.addEventListener('error', onError)
        document.querySelector('body').appendChild(sc)
        window[`jsonp${randomStr}`] = function (res) {
            resolve(res)
            delete window[`jsonp${randomStr}`]
            sc.removeEventListener('error', onError)
            document.querySelector('body').removeChild(document.querySelector(`script[name=jsonp${randomStr}]`))
        }
        function onError(err) {
            reject(err)
        }
    })
}