import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const storeCollections = require.context('@/store', true, /.ts$/)
const store = {
  modules: {},
  plugins: [createPersistedState()]
}
storeCollections.keys().forEach((o) => {
  const name = o.replace('./', '').replace('.ts', '')
  // @ts-ignore
  store.modules[name] = require(`@/store/${name}`).default
})

Vue.use(Vuex)

export default new Vuex.Store(store)
