const generateLocation = (username, latitude, longitude) => {
    return {
        link:  `https://google.com/maps?q=${latitude},${longitude}`,
        username,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateLocation
}