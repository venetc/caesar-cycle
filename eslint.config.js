import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'off',
    'no-sequences': 'off',
  },
})
