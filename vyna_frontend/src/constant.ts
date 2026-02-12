// const url = 'http://44.195.125.80:9756/vyna/api/v1/'; 
// const url =  'http://127.0.0.1:9756/vyna/api/v1/';
// const url = 'http://172.16.100.210:9756/vyna/api/v1/';
// const url = 'https://vynaelectric.com/vyna/api/v1/';
const url = 'https://vyna-backend.vercel.app/vyna/api/v1/'

export const constant = {
  aboutUs: url + 'aboutus',
  banner: url + 'banner',
  category: url + 'category',
  subCategory: url + 'subcategory',
  newsletter: url + 'content/create-newletter',
  contactUs: url + 'content/get_contactus',
  ourPromises: url + 'ourpromise',
  product: url + 'product',
  award: url + 'award',
  vision: url + 'valuevision',
  faq: url + 'faq',
  faqQues: url + 'faqAsk/create-faq',
  contactForm: url + 'contactUs/create-contactus',
  getSubcategoryByCategory: url + 'category/allcategory',
  getProductBySubcategory: url + 'product/subcategoryid',
  getProductByCategory: url +'product/categoryid',
  getContent: url + 'content',
  search: url + 'product/search',
  homeAbout: url + 'homewhoweare',
  featureProduct: url + 'product/feature_producrt',
  sustainValue: url + 'aboutusSustainbility',
  getBrochure : url + 'product/new',
  cmsBanner: url + 'cmsbanner',
  getProductHtml: url + 'product/new',



}