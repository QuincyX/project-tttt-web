import $http from '@/plugin/axios'

export default {
  namespaced: true,
  state: {
    pickedList: []
  },
  getters: {
    pickedList: (state: any) => state.pickedList
  },
  mutations: {
    setPickedList: (state: any, payload: any) => (state.pickedList = payload),
    clearPickedList: (state: any) => (state.pickedList = []),
    addPicked: (state: any, payload: any) => state.pickedList.push(payload),
    updatePickedItem: (state: any, payload: any) => {
      const n = state.pickedList.findIndex((o: any) => o._id === payload._id)
      state.pickedList.splice(n, 1, payload)
    },
    deletePicked: (state: any, payload: any) => {
      const n = state.pickedList.findIndex((o: any) => o._id === payload._id)
      state.pickedList.splice(n, 1)
    },
    moveUpPicked: (state: any, payload: any) => {
      const n = state.pickedList.findIndex((o: any) => o._id === payload._id)
      if (n >= 1) {
        const previousItem = state.pickedList[n - 1]
        const currentItem = state.pickedList[n]
        state.pickedList.splice(n, 1, previousItem)
        state.pickedList.splice(n - 1, 1, currentItem)
      }
    },
    moveDownPicked: (state: any, payload: any) => {
      const n = state.pickedList.findIndex((o: any) => o._id === payload._id)
      if (n < state.pickedList.length) {
        const currentItem = state.pickedList[n]
        const nextItem = state.pickedList[n + 1]
        state.pickedList.splice(n, 1, nextItem)
        state.pickedList.splice(n + 1, 1, currentItem)
      }
    }
  },
  actions: {
    async addOutput({ commit }: any, payload: any) {
      const newAction = await $http.post(
        `/action/${payload.actionId}/output`,
        payload.output
      )
      commit('updatePickedItem', newAction)
    }
  }
}
