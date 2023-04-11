import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { sideTheme, showSettings, tagsView, fixedHeader, sidebarLogo, dialogWidth } = defaultSettings

const state = {
  theme: variables.theme,
  sideTheme: sideTheme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  activeMenu: null,
  dialogWidth: dialogWidth
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_MENU: (state, data) => {
    state.activeMenu = data
  },
  SET_DIALOG_WIDTH: (state, data) => {
    state.dialogWidth = data
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  setMenu({ commit }, data) {
    commit('SET_MENU', data)
  },
  setDialogWidth({ commit }, data) {
    commit('SET_DIALOG_WIDTH', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

