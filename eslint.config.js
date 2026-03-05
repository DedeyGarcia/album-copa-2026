const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierPlugin = require('eslint-plugin-prettier'); // Importe o plugin diretamente
const prettierConfig = require('eslint-config-prettier'); // Importe a config de desativação

module.exports = defineConfig([
  globalIgnores(['dist/*']),
  ...expoConfig, // Use o spread operator se o expoConfig for um array
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Desativa regras conflitantes
      'prettier/prettier': 'error',
    },
  },
]);
