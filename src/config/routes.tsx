const API_BASE_URL: string = 'http://localhost:9000/';

export const register: string = `${API_BASE_URL}register`;
export const login: string = `${API_BASE_URL}login`;
export const logout: string = `${API_BASE_URL}logout`;
export const blogsLiterarios: string = `${API_BASE_URL}blogs_literarios`;
export const reviewers: string = `${API_BASE_URL}reviewers`;
export const books: string = `${API_BASE_URL}books`;
export const mybooks: string = `${API_BASE_URL}books/private`;
export const book: string = `${API_BASE_URL}book`;
export const update: string = `${API_BASE_URL}update`;
export const registerBook: string = `${API_BASE_URL}registerBook`;
export const registerBlog: string = `${API_BASE_URL}registerBlog`;
export const forgotPass: string = `${API_BASE_URL}users/forgot`;
export const resetPass: string = `${API_BASE_URL}users/reset`;
