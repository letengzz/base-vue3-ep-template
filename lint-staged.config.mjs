/**  @type {import('lint-staged').Config} */
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.json': ['eslint --fix'],
  '*.vue': ['eslint --fix'],
  '*.{scss,less,styl,html}': ['stylelint --fix --allow-empty-input'],
  '*.md': ['prettier --write', 'eslint --fix'],
}
