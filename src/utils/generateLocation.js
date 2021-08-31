const generateLocation = (latitude, longitude) => {
    return {
        link:  `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateLocation
}