const {I18n} = require('i18n');
const i18n = new I18n();
const path = require('path');

i18n.configure({
    fallbackLng : 'en',
    locales: ['fr' ],
    directory: path.join(__dirname, './locales'),
    defaultLocale : 'en'
})

module.exports = i18n;